from django.db import migrations
from django.contrib.auth.hashers import make_password


def seed_demo_content(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Category = apps.get_model('api', 'Category')
    ItemPost = apps.get_model('api', 'ItemPost')
    ClaimRequest = apps.get_model('api', 'ClaimRequest')

    users_data = [
        ('student1001', '12345678'),
        ('aigerim_demo', '12345678'),
        ('nursultan_demo', '12345678'),
    ]

    users = {}
    for username, password in users_data:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': f'{username}@example.com'}
        )
        if created or not user.password or not str(user.password).startswith('pbkdf2_'):
            user.password = make_password(password)
            user.save(update_fields=['password'])
        users[username] = user

    categories = {category.slug: category for category in Category.objects.all()}

    items_data = [
        {
            'title': 'Blue Student ID Card',
            'description': 'Found near the main library entrance after the evening classes.',
            'item_type': 'found',
            'location': 'Main Library',
            'event_date': '2026-04-18',
            'image_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            'contact_info': 'Telegram: @student1001',
            'status': 'active',
            'category_slug': 'documents',
            'owner': 'student1001',
        },
        {
            'title': 'Black Wallet with KBTU Sticker',
            'description': 'Lost somewhere between the cafeteria and Block B.',
            'item_type': 'lost',
            'location': 'Block B Hallway',
            'event_date': '2026-04-17',
            'image_url': 'https://images.unsplash.com/photo-1627123424574-724758594e93',
            'contact_info': 'WhatsApp: +7 700 111 2233',
            'status': 'active',
            'category_slug': 'accessories',
            'owner': 'aigerim_demo',
        },
        {
            'title': 'Silver MacBook Charger',
            'description': 'Found in the coworking zone on the second floor.',
            'item_type': 'found',
            'location': 'Coworking Zone',
            'event_date': '2026-04-20',
            'image_url': 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8',
            'contact_info': 'Telegram: @nursultan_demo',
            'status': 'active',
            'category_slug': 'electronics',
            'owner': 'nursultan_demo',
        },
        {
            'title': 'Grey Backpack',
            'description': 'Lost after the programming lab. It has a math notebook inside.',
            'item_type': 'lost',
            'location': 'Engineering Building Room 302',
            'event_date': '2026-04-16',
            'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            'contact_info': 'Telegram: @aigerim_demo',
            'status': 'active',
            'category_slug': 'bags',
            'owner': 'aigerim_demo',
        },
        {
            'title': 'White AirPods Case',
            'description': 'Found on a bench near the central atrium.',
            'item_type': 'found',
            'location': 'Central Atrium',
            'event_date': '2026-04-19',
            'image_url': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46',
            'contact_info': 'Call: +7 701 222 3344',
            'status': 'active',
            'category_slug': 'electronics',
            'owner': 'student1001',
        },
        {
            'title': 'Dark Blue Hoodie',
            'description': 'Lost after the weekend student club meeting.',
            'item_type': 'lost',
            'location': 'Student Lounge',
            'event_date': '2026-04-15',
            'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            'contact_info': 'Instagram: @nur.demo',
            'status': 'returned',
            'category_slug': 'clothes',
            'owner': 'nursultan_demo',
        },
        {
            'title': 'Passport Cover with Cards',
            'description': 'Found close to the reception desk in the main hall.',
            'item_type': 'found',
            'location': 'Main Hall Reception',
            'event_date': '2026-04-14',
            'image_url': 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
            'contact_info': 'Telegram: @student1001',
            'status': 'active',
            'category_slug': 'documents',
            'owner': 'student1001',
        },
        {
            'title': 'Wireless Mouse Logitech',
            'description': 'Lost during the project meeting in the innovation lab.',
            'item_type': 'lost',
            'location': 'Innovation Lab',
            'event_date': '2026-04-13',
            'image_url': 'https://images.unsplash.com/photo-1527814050087-3793815479db',
            'contact_info': 'WhatsApp: +7 705 555 1122',
            'status': 'active',
            'category_slug': 'electronics',
            'owner': 'aigerim_demo',
        },
    ]

    items = {}
    for item_data in items_data:
        item, _ = ItemPost.objects.get_or_create(
            title=item_data['title'],
            defaults={
                'description': item_data['description'],
                'item_type': item_data['item_type'],
                'location': item_data['location'],
                'event_date': item_data['event_date'],
                'image_url': item_data['image_url'],
                'contact_info': item_data['contact_info'],
                'status': item_data['status'],
                'category': categories[item_data['category_slug']],
                'owner': users[item_data['owner']],
            }
        )
        items[item_data['title']] = item

    claims_data = [
        {
            'item_title': 'Blue Student ID Card',
            'username': 'aigerim_demo',
            'message': 'This ID belongs to me. My department is FIT and the card has a small scratch near the photo.',
            'contact_info': 'Telegram: @aigerim_demo',
            'status': 'pending',
        },
        {
            'item_title': 'Silver MacBook Charger',
            'username': 'student1001',
            'message': 'It should be mine. I can describe the cable mark near the adapter.',
            'contact_info': 'WhatsApp: +7 700 555 9900',
            'status': 'approved',
        },
    ]

    for claim_data in claims_data:
        ClaimRequest.objects.get_or_create(
            item=items[claim_data['item_title']],
            user=users[claim_data['username']],
            defaults={
                'message': claim_data['message'],
                'contact_info': claim_data['contact_info'],
                'status': claim_data['status'],
            }
        )


def remove_demo_content(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    ItemPost = apps.get_model('api', 'ItemPost')
    ClaimRequest = apps.get_model('api', 'ClaimRequest')

    demo_titles = [
        'Blue Student ID Card',
        'Black Wallet with KBTU Sticker',
        'Silver MacBook Charger',
        'Grey Backpack',
        'White AirPods Case',
        'Dark Blue Hoodie',
        'Passport Cover with Cards',
        'Wireless Mouse Logitech',
    ]
    demo_usernames = ['student1001', 'aigerim_demo', 'nursultan_demo']

    ClaimRequest.objects.filter(item__title__in=demo_titles).delete()
    ItemPost.objects.filter(title__in=demo_titles).delete()
    User.objects.filter(username__in=demo_usernames).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0002_seed_categories'),
    ]

    operations = [
        migrations.RunPython(seed_demo_content, remove_demo_content),
    ]
