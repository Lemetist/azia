from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import signing
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()


def _token_lifetime_seconds(setting_name: str, default_seconds: int) -> int:
    lifetime = settings.SIMPLE_JWT.get(setting_name, timedelta(seconds=default_seconds))

    if isinstance(lifetime, timedelta):
        return int(lifetime.total_seconds())

    if isinstance(lifetime, (int, float)):
        return int(lifetime)

    return default_seconds


def _issue_token(user, *, salt: str) -> str:
    return signing.dumps({"user_id": user.pk}, salt=salt)


def _load_token(token: str, *, salt: str, max_age: int) -> dict:
    try:
        payload = signing.loads(token, salt=salt, max_age=max_age)
    except signing.BadSignature as exc:
        raise AuthenticationFailed("Invalid token.") from exc
    except signing.SignatureExpired as exc:
        raise AuthenticationFailed("Token has expired.") from exc

    if not isinstance(payload, dict) or "user_id" not in payload:
        raise AuthenticationFailed("Invalid token payload.")

    return payload


def issue_access_token(user) -> str:
    return _issue_token(user, salt="api.access")


def issue_refresh_token(user) -> str:
    return _issue_token(user, salt="api.refresh")


def get_user_from_access_token(token: str):
    payload = _load_token(
        token,
        salt="api.access",
        max_age=_token_lifetime_seconds("ACCESS_TOKEN_LIFETIME", 30 * 60),
    )
    return _get_active_user(payload["user_id"])


def get_user_from_refresh_token(token: str):
    payload = _load_token(
        token,
        salt="api.refresh",
        max_age=_token_lifetime_seconds("REFRESH_TOKEN_LIFETIME", 60 * 24 * 60 * 60),
    )
    return _get_active_user(payload["user_id"])


def _get_active_user(user_id: int):
    user = User.objects.filter(pk=user_id, is_active=True).first()

    if user is None:
        raise AuthenticationFailed("User not found.")

    return user
