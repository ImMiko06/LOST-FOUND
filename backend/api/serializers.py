from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Category, ClaimRequest, ItemPost


class UserProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ItemPostSerializer(serializers.ModelSerializer):
    owner = UserProfileSerializer(read_only=True)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = ItemPost
        fields = [
            'id',
            'title',
            'description',
            'item_type',
            'location',
            'event_date',
            'image',
            'image_url',
            'contact_info',
            'status',
            'created_at',
            'updated_at',
            'category',
            'category_name',
            'owner',
            'owner_id',
        ]

    def get_image(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return None
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class ItemPostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPost
        fields = [
            'id',
            'title',
            'description',
            'item_type',
            'location',
            'event_date',
            'image',
            'image_url',
            'contact_info',
            'status',
            'category',
        ]


class ClaimRequestSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    item_title = serializers.CharField(source='item.title', read_only=True)

    class Meta:
        model = ClaimRequest
        fields = [
            'id',
            'item',
            'item_title',
            'user',
            'message',
            'contact_info',
            'status',
            'created_at',
        ]


class ClaimRequestCreateSerializer(serializers.Serializer):
    item = serializers.IntegerField()
    message = serializers.CharField()
    contact_info = serializers.CharField(max_length=160)
