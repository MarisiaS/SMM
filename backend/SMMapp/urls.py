from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from SMMapp.views.CustomTokenRefreshView import CustomTokenRefreshView
from SMMapp.views.LogoutView import LogoutView

urlpatterns = [
    path("login/", TokenObtainPairView.as_view()),
    path("login/refresh/", CustomTokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),
]