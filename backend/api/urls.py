from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from api.views.CustomTokenRefreshView import CustomTokenRefreshView
from api.views.LogoutView import LogoutView
from api.views.SiteView import SiteViewSet
from api.views.SchoolView import SchoolViewSet
from api.views.GroupView import GroupViewSet
from api.views.EventTypeView import EventTypeViewSet
from api.views.SessionView import SessionViewSet
from api.views.SwimMeetView import SwimMeetViewSet
from api.views.MeetSchoolView import MeetSchoolView
from api.views.AthleteView import AthleteViewSet
from api.views.TimeRecordView import TimeRecordViewSet
from api.views.MeetEventView import MeetEventView
from api.views.AtheleteSeedTimeView import AthleteSeedTimeView
from api.views.HeatView import HeatBatchView, HeatDetailView
from api.views.LaneView import LaneBatchView, LaneDetailView, UpdateHeatTimeView
from api.views.EventResultView import EventResultView
from api.views.download.DownloadHeats import DownloadAllHeatsByEvent, DownloadAllHeatsByMeet
from api.views.download.DownloadResults import DownloadEventResults

from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'site', SiteViewSet, basename='site')
router.register(r'school', SchoolViewSet, basename='school')
router.register(r'group', GroupViewSet, basename='group')
router.register(r'eventtype', EventTypeViewSet, basename='type')
router.register(r'session', SessionViewSet, basename='session')
router.register(r'swimmeet', SwimMeetViewSet, basename='swimmeet')
router.register(r'athlete', AthleteViewSet, basename='athlete')
router.register(r'timerecord', TimeRecordViewSet, basename='timerecord')


urlpatterns = [
    path("login/", TokenObtainPairView.as_view()),
    path("login/refresh/", CustomTokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('auth/', include('djoser.urls')),
    path('meet_schools/<int:meet_id>/',
         MeetSchoolView.as_view(), name='meet-schools'),
    path('meet_event/<int:meet_id>/', MeetEventView.as_view(), name='events-meet'),
    path('seed_times/<int:event_id>/',
         AthleteSeedTimeView.as_view(), name='seed-times'),
    path('event_heat/<int:event_id>/',
         HeatBatchView.as_view(), name='heats-event'),
    path('event_heat/<int:event_id>/<int:heat_num>/',
         HeatDetailView.as_view(), name='heat-detail'),
    path('event_lane/<int:event_id>/',
         LaneBatchView.as_view(), name='lanes-event'),
    path('event_lane/<int:event_id>/<int:lane_num>/',
         LaneDetailView.as_view(), name='lane-detail'),
    path('event_result/<int:event_id>/',
         EventResultView.as_view(), name='event-result'),
    path('download-heats-details/<int:event_id>/',
         DownloadAllHeatsByEvent.as_view(), name='download-event-heats-details'),
    path('download-all-heats-details/<int:meet_id>/',
         DownloadAllHeatsByMeet.as_view(), name='download-meet-heats-details'),
    path('download-event-results/<int:event_id>/',
         DownloadEventResults.as_view(), name='download-event-results'),
    path('event_lane/update_heat_times/',
         UpdateHeatTimeView.as_view(), name='update-heat-time')
]

urlpatterns += router.urls
