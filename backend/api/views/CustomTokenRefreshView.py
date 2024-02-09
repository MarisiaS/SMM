from api.serializers.CustomTokenRefreshSerializer import CustomTokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView


class CustomTokenRefreshView(TokenRefreshView):
    
    # Replace the serializer with the custom
    serializer_class = CustomTokenRefreshSerializer