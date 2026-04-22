import os

environment = os.getenv("DJANGO_ENV", "dev").lower()

if environment == "prod":
    from .config.prod import *  # noqa: F401,F403
else:
    from .config.dev import *  # noqa: F401,F403
