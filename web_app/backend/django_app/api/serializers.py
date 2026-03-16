from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "password"]
        read_only_fields = ["id", "username"]

    def validate_email(self, value):
        normalized_email = value.strip().lower()

        if User.objects.filter(username=normalized_email).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")

        return normalized_email

    def create(self, validated_data):
        email = validated_data["email"]
        full_name = validated_data.pop("full_name", "").strip()
        first_name = ""
        last_name = ""

        if full_name:
            name_parts = full_name.split(maxsplit=1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=validated_data["password"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name"]

    def get_full_name(self, obj):
        return obj.get_full_name().strip()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get(self.username_field, "")

        if isinstance(username, str) and username.strip():
            user = User.objects.filter(username__iexact=username.strip()).first()
            if user:
                attrs[self.username_field] = user.get_username()

        return super().validate(attrs)
