"""
WSGI config for shop_back project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path

from django.core.wsgi import get_wsgi_application

BASE_DIR = Path(__file__).resolve().parent.parent
vendor_path = str(BASE_DIR / 'vendor')
if vendor_path not in sys.path:
    sys.path.insert(0, vendor_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_back.settings')

application = get_wsgi_application()
