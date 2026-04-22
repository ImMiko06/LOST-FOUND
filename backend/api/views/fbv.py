from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import Category, ClaimRequest, ItemPost
from api.serializers import (
    ClaimRequestCreateSerializer,
    ClaimRequestSerializer,
    ItemPostSerializer,
    LoginSerializer,
    RegisterSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({'user': {'id': user.id, 'username': user.username}}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data['username'].strip()
    password = serializer.validated_data['password']

    matched_user = User.objects.filter(username__iexact=username).first()
    if not matched_user:
        return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=matched_user.username, password=password)
    if not user:
        return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {'id': user.id, 'username': user.username},
        }
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'detail': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        return Response({'detail': 'Invalid refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_205_RESET_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def items_search(request):
    query = request.GET.get('q', '').strip()
    category = request.GET.get('category')
    item_type = request.GET.get('item_type')

    queryset = ItemPost.objects.select_related('category', 'owner').all()
    if query:
        queryset = queryset.filter(Q(title__icontains=query) | Q(description__icontains=query))
    if category:
        queryset = queryset.filter(category_id=category)
    if item_type in {ItemPost.ItemType.LOST, ItemPost.ItemType.FOUND}:
        queryset = queryset.filter(item_type=item_type)

    serializer = ItemPostSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def claim_requests_list_create(request):
    if request.method == 'GET':
        claims = ClaimRequest.objects.select_related('item', 'user').filter(
            Q(user=request.user) | Q(item__owner=request.user)
        ).distinct()
        serializer = ClaimRequestSerializer(claims, many=True)
        return Response(serializer.data)

    serializer = ClaimRequestCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    item = get_object_or_404(ItemPost, id=serializer.validated_data['item'])
    if item.owner == request.user:
        return Response({'detail': 'You cannot claim your own post.'}, status=status.HTTP_400_BAD_REQUEST)

    claim, created = ClaimRequest.objects.get_or_create(
        item=item,
        user=request.user,
        defaults={
            'message': serializer.validated_data['message'],
            'contact_info': serializer.validated_data['contact_info'],
        },
    )

    if not created:
        return Response({'detail': 'You have already sent a claim for this item.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(ClaimRequestSerializer(claim).data, status=status.HTTP_201_CREATED)
