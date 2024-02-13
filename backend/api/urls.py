from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from api.views.CustomTokenRefreshView import CustomTokenRefreshView
from api.views.LogoutView import LogoutView
from api.views.SiteView import SiteViewSet
from api.views.SchoolView import SchoolViewSet
from api.views.SessionView import SessionViewSet

from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'site', SiteViewSet, basename='sites')
router.register(r'school', SchoolViewSet, basename='school')
router.register(r'session', SessionViewSet, basename='session')

urlpatterns = [
    path("login/", TokenObtainPairView.as_view()),
    path("login/refresh/", CustomTokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('auth/', include('djoser.urls')),
]

urlpatterns += router.urls
