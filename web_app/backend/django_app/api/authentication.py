from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .tokens import get_user_from_access_token


class BearerTokenAuthentication(BaseAuthentication):
    keyword = b"bearer"

    def authenticate(self, request):
        header = get_authorization_header(request).split()

        if not header:
            return None

        if header[0].lower() != self.keyword:
            return None

        if len(header) != 2:
            raise AuthenticationFailed("Invalid Authorization header.")

        try:
            token = header[1].decode("utf-8")
        except UnicodeError as exc:
            raise AuthenticationFailed("Invalid token.") from exc

        user = get_user_from_access_token(token)
        return (user, token)
