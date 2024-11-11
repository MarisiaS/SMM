from io import BytesIO
import pandas as pd
from api.models import Heat, MeetEvent
from django.http import FileResponse, HttpResponse
from docx import Document
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Alignment

from rest_framework.views import APIView
from api.serializers.HeatDisplaySerializer import HeatSerializer,LaneSerializer



class DownloadHeats(APIView):

    def generate_excel_from_lanes_data(self, event_name, heats_data, lanes_data):
        # Create an in-memory workbook
        workbook = Workbook()
        heat_worksheet = workbook.active
        heat_worksheet.title = "Heats Data"

        # Headers for the heats table
        headers = ["Lane", "Athlete", "Seed Time", "Heat Time"]

        current_row = 1

        title_cell = heat_worksheet.cell(row=current_row, column=1)
        title_cell.value = event_name
        heat_worksheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=len(headers))
        title_cell = heat_worksheet.cell(row=current_row, column=1)
        title_cell.style = 'Title'
        title_cell.alignment = Alignment(horizontal='center', vertical='center')
       
        current_row += 2
        

        for heat in heats_data:
            heat_name = heat.get("heat_name")
            lanes = heat.get("lanes", [])

            # Set the title for each heat in the first cell of the row
            title_cell = heat_worksheet.cell(row=current_row, column=1)
            title_cell.value = heat_name
            heat_worksheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=len(headers))
            title_cell.style = 'Title'
            
            current_row += 1
            
            # Set Headers
            for col_num, header in enumerate(headers, start=1):
                cell = heat_worksheet.cell(row=current_row, column=col_num)
                cell.value = header
                cell.style = 'Headline 1' 

            # Populate the table with lane data for the current heat
            for lane in lanes:
                current_row += 1
                heat_worksheet.cell(row=current_row, column=1, value=lane.get("lane_num"))
                heat_worksheet.cell(row=current_row, column=2, value=lane.get("athlete_full_name"))
                heat_worksheet.cell(row=current_row, column=3, value=lane.get("seed_time"))
                heat_worksheet.cell(row=current_row, column=4, value=lane.get("heat_time"))

            current_row += 2

       # ========================= Lanes Data Worksheet =========================
        lanes_worksheet = workbook.create_sheet(title="Lanes Data")

        # Headers for the lanes data 
        lanes_headers = ["Heat", "Athlete", "Seed Time", "Heat Time"]
        current_row = 1

        title_cell = heat_worksheet.cell(row=current_row, column=1)
        title_cell.value = event_name
        heat_worksheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=len(headers))
        title_cell = heat_worksheet.cell(row=current_row, column=1)
        title_cell.style = 'Title'
        title_cell.alignment = Alignment(horizontal='center', vertical='center')
        
        current_row += 2
        
        # Add a title for Lane Number
        lanes_worksheet.cell(row=current_row, column=1, value="Lane Number")
        lanes_worksheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=len(lanes_headers))
        title_cell = lanes_worksheet.cell(row=current_row, column=1)
        title_cell.alignment = Alignment(horizontal='center', vertical='center')

        current_row += 2

        for lane in lanes_data:
            lane_name = heat.get("lane_name")
            heats = lane.get("heats", [])

            # Set the title for each heat in the first cell of the row
            title_cell = heat_worksheet.cell(row=current_row, column=1)
            title_cell.value = lane_name
            heat_worksheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=len(lanes_headers))
            title_cell.style = 'Title'
            
            # Move to the next row for headers
            current_row += 1

            # Add headers
            for col_num, header in enumerate(headers, start=1):
                cell = heat_worksheet.cell(row=current_row, column=col_num)
                cell.value = header
                cell.style = 'Headline 1'  

            # Populate the table with lane data for the current heat
            for heat in heats:
                current_row += 1
                heat_worksheet.cell(row=current_row, column=1, value=lane.get("num_heat"))
                heat_worksheet.cell(row=current_row, column=2, value=lane.get("athlete_full_name"))
                heat_worksheet.cell(row=current_row, column=3, value=lane.get("heat_time"))

            current_row += 1

        # Adjust column widths for readability in both worksheets
        for worksheet in [heat_worksheet, lanes_worksheet]:
            for col_num in range(1, len(headers) + 1):
                col_letter = get_column_letter(col_num)
                worksheet.column_dimensions[col_letter].width = 15

        # Save the workbook to an in-memory file
        file_buffer = BytesIO()
        workbook.save(file_buffer)
        file_buffer.seek(0)

        # Create an HTTP response with the Excel file for download
        response = HttpResponse(
            file_buffer,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="heats_data.xlsx"'
        return response

    

    @extend_schema(
        summary='Send Binary response',
        parameters=[
            OpenApiParameter(name='res_type',type=str,enum=['text','excel','docs'],required=True,location=OpenApiParameter.PATH),
            OpenApiParameter(name='event_id',type=int,required=True,location=OpenApiParameter.QUERY),
            OpenApiParameter(name='heat_num',type=int,required=True,location=OpenApiParameter.QUERY)
        ],
        responses={
            200: OpenApiResponse(description='Binary Response'),
            404: OpenApiResponse(description='Resource not found')
        }
    )
    def post(self,request,event_id, res_type): 
        #Get event instance
        event_instance = MeetEvent.objects.get(id=event_id)
        event_name = event_instance.name

        #Get number of lanes on the event
        swim_meet_instance = event_instance.swim_meet
        num_lanes = swim_meet_instance.site.num_lanes
        
        max_num_heat = event_instance.total_num_heats 

        if max_num_heat:
            heats_data = []
            for heat_num in range (1,max_num_heat+1):
                # Retrieve all heats for the given event_id and heat_num
                heats = Heat.objects.filter(event_id=event_id, num_heat=heat_num)
                lanes_data = []
                for lane_num in range(1, num_lanes + 1):
                    lane_data = heats.filter(lane_num=lane_num).first()
                    if lane_data is not None:
                        lanes_data.append(lane_data)
                    else:
                        lanes_data.append({
                            "id": None,
                            "lane_num": lane_num,
                            "athlete": None,
                            "seed_time": None,
                            "heat_time": None
                    })
                serializer = HeatSerializer(lanes_data, many=True)
                heats_data.append({
                "id": heat_num,
                "heat_name": f"Heat {heat_num}",
                "lanes": serializer.data
            })
                
            lanes_data = []
            for lane_num in range (1,num_lanes+1):
                # Retrieve all heats for the given event_id and lane_num
                heats = Heat.objects.filter(event_id=event_id, lane_num=lane_num)
                heats_data = []
                for heat in range(1, max_num_heat + 1):
                    heat_data = heats.filter(num_heat=heat).first()
                    if heat_data is not None:
                        heats_data.append(heat_data)
                    else:
                        heats_data.append({
                            "id": None,
                            "num_heat": heat,
                            "athlete": None,
                            "seed_time": None
                    })
                serializer = LaneSerializer(heats_data, many=True)
                lanes_data.append({
                "id": lane_num,
                "lane_name": f"Lane {lane_num}",
                "heats": serializer.data
            })
            
        print(heats_data)       

        if res_type == 'excel':
           return self.generate_excel_from_lanes_data(event_name, heats_data, lanes_data)

