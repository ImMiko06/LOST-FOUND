from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Category, ItemPost
from api.serializers import CategorySerializer, ItemPostSerializer, ItemPostWriteSerializer


class CategoryListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class ItemListAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        queryset = ItemPost.objects.select_related('category', 'owner').all()
        category = request.GET.get('category')
        item_type = request.GET.get('item_type')
        mine = request.GET.get('mine')

        if category:
            queryset = queryset.filter(category_id=category)
        if item_type in {ItemPost.ItemType.LOST, ItemPost.ItemType.FOUND}:
            queryset = queryset.filter(item_type=item_type)
        if mine == '1' and request.user.is_authenticated:
            queryset = queryset.filter(owner=request.user)

        serializer = ItemPostSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ItemPostWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save(owner=request.user)
        return Response(ItemPostSerializer(item, context={'request': request}).data, status=status.HTTP_201_CREATED)


class ItemDetailAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, item_id):
        return get_object_or_404(ItemPost.objects.select_related('category', 'owner'), id=item_id)

    def get(self, request, item_id):
        item = self.get_object(item_id)
        return Response(ItemPostSerializer(item, context={'request': request}).data)

    def put(self, request, item_id):
        item = self.get_object(item_id)
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        if item.owner != request.user:
            return Response({'detail': 'You can edit only your own posts.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ItemPostWriteSerializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_item = serializer.save()
        return Response(ItemPostSerializer(updated_item, context={'request': request}).data)

    def delete(self, request, item_id):
        item = self.get_object(item_id)
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        if item.owner != request.user:
            return Response({'detail': 'You can delete only your own posts.'}, status=status.HTTP_403_FORBIDDEN)

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyPostsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = ItemPost.objects.select_related('category', 'owner').filter(owner=request.user)
        serializer = ItemPostSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
