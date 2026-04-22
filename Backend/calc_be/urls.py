"""
URL configuration for calc_be project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from calculator.views import calculate, rates

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/", include("core.urls")),
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/investments/", include("calculator.urls")),
    path("api/v1/learning/", include("learning.urls")),
    path("api/v1/analytics/", include("analytics.urls")),
    path("api/v1/rates/", rates, name="rates"),
    path("api/v1/calculate/", calculate, name="calculate"),
    path("api/v1/chat/", include("chatbot.urls")),
]
