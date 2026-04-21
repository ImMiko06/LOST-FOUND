from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class ItemPost(models.Model):
    class ItemType(models.TextChoices):
        LOST = 'lost', 'Lost'
        FOUND = 'found', 'Found'

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        RETURNED = 'returned', 'Returned'

    title = models.CharField(max_length=160)
    description = models.TextField()
    item_type = models.CharField(max_length=10, choices=ItemType.choices)
    location = models.CharField(max_length=160)
    event_date = models.DateField()
    image = models.ImageField(upload_to='items/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    contact_info = models.CharField(max_length=160)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='item_posts')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ClaimRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    item = models.ForeignKey(ItemPost, on_delete=models.CASCADE, related_name='claim_requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='claim_requests')
    message = models.TextField()
    contact_info = models.CharField(max_length=160)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('item', 'user')

    def __str__(self):
        return f'{self.user.username} -> {self.item.title}'
