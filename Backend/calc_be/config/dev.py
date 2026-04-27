from .base import *  # noqa: F401,F403

DEBUG = True

# Dev-only: avoid CORS surprises during local frontend testing.
CORS_ALLOW_ALL_ORIGINS = True

INSTALLED_APPS = ["django_extensions", *INSTALLED_APPS]
