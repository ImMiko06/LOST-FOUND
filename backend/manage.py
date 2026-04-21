#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    base_dir = os.path.dirname(__file__)
    project_path = base_dir
    vendor_path = os.path.join(base_dir, 'vendor')
    if project_path not in sys.path:
        sys.path.insert(0, project_path)
    if vendor_path not in sys.path:
        sys.path.insert(0, vendor_path)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_back.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
