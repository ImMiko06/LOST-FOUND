from django.db import migrations


def seed_categories(apps, schema_editor):
    Category = apps.get_model('api', 'Category')
    categories = [
        ('Accessories', 'accessories'),
        ('Bags', 'bags'),
        ('Clothes', 'clothes'),
        ('Documents', 'documents'),
        ('Electronics', 'electronics'),
        ('Other', 'other'),
    ]

    for name, slug in categories:
        Category.objects.get_or_create(name=name, slug=slug)


def unseed_categories(apps, schema_editor):
    Category = apps.get_model('api', 'Category')
    Category.objects.filter(slug__in=[
        'accessories',
        'bags',
        'clothes',
        'documents',
        'electronics',
        'other',
    ]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_categories, unseed_categories),
    ]
