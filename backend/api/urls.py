from django.urls import path

from .views import (
    CategoryListAPIView,
    ItemDetailAPIView,
    ItemListAPIView,
    MyPostsAPIView,
    claim_requests_list_create,
    items_search,
    login_view,
    logout_view,
    register_view,
)

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('categories/', CategoryListAPIView.as_view(), name='category_list'),
    path('items/', ItemListAPIView.as_view(), name='item_list'),
    path('items/search/', items_search, name='items_search'),
    path('items/<int:item_id>/', ItemDetailAPIView.as_view(), name='item_detail'),
    path('my-items/', MyPostsAPIView.as_view(), name='my_items'),
    path('claims/', claim_requests_list_create, name='claims'),
]
