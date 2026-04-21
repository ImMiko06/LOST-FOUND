from django.contrib import admin

from .models import Category, ClaimRequest, ItemPost


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name', 'slug')


@admin.register(ItemPost)
class ItemPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'item_type', 'status', 'category', 'owner', 'event_date')
    list_filter = ('item_type', 'status', 'category')
    search_fields = ('title', 'description', 'location')


@admin.register(ClaimRequest)
class ClaimRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'user', 'status', 'created_at')
    list_filter = ('status',)
