from django.urls import path

from .views import complete_module, modules, progress

urlpatterns = [
    path("modules/", modules, name="learning-modules"),
    path("progress/", progress, name="learning-progress"),
    path("progress/complete/", complete_module, name="learning-progress-complete"),
]

