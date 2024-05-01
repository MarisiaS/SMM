from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from api.models import CustomUser
from rest_framework_simplejwt.state import token_backend
from rest_framework_simplejwt.utils import datetime_from_epoch, aware_utcnow
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Inherit from `TokenRefreshSerializer` and add the new refresh 
    token to the outstanding tokens.
    """

    def validate(self, attrs):

        data = super(CustomTokenRefreshSerializer, self).validate(attrs)
        print(data)
        refresh_token = str(data["refresh"])  # get the new refresh token

        # decode the new refresh token to obtain the token information
        new_refresh_token_payload = token_backend.decode(refresh_token)
        user = CustomUser.objects.get(pk=new_refresh_token_payload['user_id'])
        jti = new_refresh_token_payload["jti"]
        exp = new_refresh_token_payload["exp"]
        current_time = aware_utcnow()

        # Add the new refresh token to the outstanding tokens
        OutstandingToken.objects.get_or_create(
            user=user,
            jti=jti,
            token=refresh_token,
            created_at=current_time,
            expires_at=datetime_from_epoch(exp),
        )
            
        return data
