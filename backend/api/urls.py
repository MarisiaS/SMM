from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from api.views.CustomTokenRefreshView import CustomTokenRefreshView
from api.views.LogoutView import LogoutView
from api.views.SiteView import SiteViewSet
from api.views.SchoolView import SchoolViewSet
from api.views.GroupView import GroupViewSet
from api.views.EventTypeView import EventTypeViewSet
from api.views.SessionView import SessionViewSet
from api.views.AthleteView import AthleteViewSet

from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'site', SiteViewSet, basename='site')
router.register(r'school', SchoolViewSet, basename='school')
router.register(r'group', GroupViewSet, basename='group')
router.register(r'eventtype', EventTypeViewSet, basename='type')
router.register(r'session', SessionViewSet, basename='session')
router.register(r'athlete', AthleteViewSet, basename='athlete')


urlpatterns = [
    path("login/", TokenObtainPairView.as_view()),
    path("login/refresh/", CustomTokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('auth/', include('djoser.urls')),
]

urlpatterns += router.urls
