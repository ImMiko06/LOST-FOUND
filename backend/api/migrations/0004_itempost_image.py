from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_seed_demo_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='itempost',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='items/'),
        ),
    ]
