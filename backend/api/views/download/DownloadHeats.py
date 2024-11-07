from io import BytesIO
import pandas as pd
from api.models import Heat, MeetEvent
from django.http import FileResponse, HttpResponse
from docx import Document
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from rest_framework.views import APIView


class DownloadHeats(APIView):


    def generate_excel_from_lanes_data(self, lanes_data):
        # Create an in-memory workbook and worksheet
        workbook = Workbook()
        worksheet = workbook.active
        worksheet.title = "Lanes Data"

        # Define headers for the fields in lanes_data
        headers = ["Lane Number", "Athlete Name", "Seed Time", "Result Time", "Event"]
        for col_num, header in enumerate(headers, 1):
            cell = worksheet.cell(row=1, column=col_num)
            cell.value = header
            cell.style = 'Headline 1'  # Optional: adds style to headers

        # Populate the worksheet with lanes_data
        for row_num, lane in enumerate(lanes_data, 2):  # Start at row 2 to leave space for headers
            worksheet.cell(row=row_num, column=1, value=lane.get("lane_number"))
            worksheet.cell(row=row_num, column=2, value=lane.get("athlete_name"))
            worksheet.cell(row=row_num, column=3, value=lane.get("seed_time"))
            worksheet.cell(row=row_num, column=4, value=lane.get("result_time"))
            worksheet.cell(row=row_num, column=5, value=lane.get("event_name"))

        # Adjust column widths
        for col_num, header in enumerate(headers, 1):
            col_letter = get_column_letter(col_num)
            worksheet.column_dimensions[col_letter].width = 15  # Adjust as needed

        # Save the workbook to an in-memory file
        file_buffer = BytesIO()
        workbook.save(file_buffer)
        file_buffer.seek(0)  # Move to the start of the file

        # Create an HTTP response with the Excel file for download
        response = HttpResponse(
            file_buffer,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="lanes_data.xlsx"'
        return response


    def get_excel(self,queryset):
        file_name = 'Heats.xlsx'
        byte_buffer = BytesIO()
        df = pd.DataFrame.from_dict(queryset.values())
        writer = pd.ExcelWriter(byte_buffer,engine='xlsxwriter')
        df.to_excel(writer,sheet_name='Heats',index=False)
        df2 = pd.DataFrame.from_dict(queryset.filter(lane_num=1).values())  
        df2.to_excel(writer,sheet_name='Lanes',index=False)
        writer.close()
        return byte_buffer,file_name

    

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
    def post(self,request,event_id, heat_num, res_type): 
        #Get event instance
        event_instance = MeetEvent.objects.get(id=event_id)
          
        #Get number of lanes on the event
        swim_meet_instance = event_instance.swim_meet
        num_lanes = swim_meet_instance.site.num_lanes
         
        #Get number of heats on the event
        max_num_heat = event_instance.total_num_heats 
        if max_num_heat:
            if 1<= heat_num <= max_num_heat:
                # Retrieve all heats for the given event_id and heat_num
                heats = Heat.objects.filter(event_id=event_id, num_heat=heat_num)
                lanes_data = []
                for lane_num in range(1, num_lanes + 1):
                    lane_data = heats.filter(lane_num=lane_num).first()
                    if lane_data is not None:
                        lanes_data.append({
                            "lane_number": lane_data.lane_num,
                            "athlete_name": lane_data.athlete.full_name if lane_data.athlete else None,
                            "seed_time": lane_data.seed_time,
                            "result_time": lane_data.heat_time,
                            "event_name": event_instance.name
                        })
                    else:
                        lanes_data.append({
                            "id": None,
                            "lane_num": lane_num,
                            "athlete": None,
                            "seed_time": None,
                            "heat_time": None
                    })


        if res_type == 'excel':
            #byte_buffer,file_name = self.get_excel(lanes_data)
        #byte_buffer.seek(0)
        #return FileResponse(byte_buffer,filename=file_name,as_attachment=True)
            return self.generate_excel_from_lanes_data(lanes_data)

