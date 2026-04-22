from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from core.responses import error_response, success_response

from .constants import LEARNING_MODULES
from .models import ModuleProgress
from .serializers import (
    ModuleCompletionSerializer,
    ModuleProgressQuerySerializer,
    ModuleProgressUpsertSerializer,
)


def _serialize_progress(progress: ModuleProgress):
    module_meta = LEARNING_MODULES.get(progress.module_key, {})
    return {
        "module_key": progress.module_key,
        "module_title": module_meta.get("title"),
        "step_index": progress.step_index,
        "completed": progress.completed,
        "metadata": progress.metadata,
        "updated_at": progress.updated_at.isoformat(),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def modules(request):
    user_progress = {
        item.module_key: item
        for item in ModuleProgress.objects.filter(user=request.user)
    }

    items = []
    for module_key, module in LEARNING_MODULES.items():
        progress = user_progress.get(module_key)
        step_count = module["step_count"]
        step_index = progress.step_index if progress else 0
        completed = progress.completed if progress else False

        items.append(
            {
                "module_key": module_key,
                "title": module["title"],
                "description": module["description"],
                "step_count": step_count,
                "progress": {
                    "step_index": step_index,
                    "completed": completed,
                    "completion_rate": 1.0 if completed else min(step_index / max(step_count, 1), 1.0),
                    "updated_at": progress.updated_at.isoformat() if progress else None,
                },
            }
        )

    return success_response(
        data={"items": items, "count": len(items)},
        message="Learning modules fetched",
    )


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def progress(request):
    if request.method == "GET":
        serializer = ModuleProgressQuerySerializer(data=request.query_params)
        if not serializer.is_valid():
            return error_response(
                message="Invalid progress query",
                error=serializer.errors,
                status_code=400,
            )

        module_key = serializer.validated_data.get("module_key")
        queryset = ModuleProgress.objects.filter(user=request.user).order_by("module_key")
        if module_key:
            queryset = queryset.filter(module_key=module_key)

        items = [_serialize_progress(item) for item in queryset]
        return success_response(
            data={"items": items, "count": len(items)},
            message="Learning progress fetched",
        )

    serializer = ModuleProgressUpsertSerializer(data=request.data)
    if not serializer.is_valid():
        return error_response(
            message="Invalid progress payload",
            error=serializer.errors,
            status_code=400,
        )

    payload = serializer.validated_data
    module_key = payload["module_key"]
    step_index = payload["step_index"]
    metadata = payload.get("metadata", {})
    completed = payload.get("completed", False)

    step_count = LEARNING_MODULES[module_key]["step_count"]
    if step_index > step_count:
        return error_response(
            message="Invalid step index",
            error={"step_index": [f"Must be <= {step_count} for module {module_key}."]},
            status_code=400,
        )

    progress_obj, created = ModuleProgress.objects.get_or_create(
        user=request.user,
        module_key=module_key,
        defaults={
            "step_index": step_index,
            "completed": completed,
            "metadata": metadata,
        },
    )

    if not created:
        progress_obj.step_index = step_index
        progress_obj.completed = completed
        progress_obj.metadata = metadata
        progress_obj.save(update_fields=["step_index", "completed", "metadata", "updated_at"])

    return success_response(
        data=_serialize_progress(progress_obj),
        message="Learning progress saved",
        status_code=201 if created else 200,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_module(request):
    serializer = ModuleCompletionSerializer(data=request.data)
    if not serializer.is_valid():
        return error_response(
            message="Invalid completion payload",
            error=serializer.errors,
            status_code=400,
        )

    payload = serializer.validated_data
    module_key = payload["module_key"]
    step_count = LEARNING_MODULES[module_key]["step_count"]
    step_index = payload.get("step_index", step_count)
    metadata = payload.get("metadata", {})

    if step_index > step_count:
        return error_response(
            message="Invalid step index",
            error={"step_index": [f"Must be <= {step_count} for module {module_key}."]},
            status_code=400,
        )

    progress_obj, created = ModuleProgress.objects.get_or_create(
        user=request.user,
        module_key=module_key,
        defaults={
            "step_index": step_index,
            "completed": True,
            "metadata": metadata,
        },
    )

    if not created:
        progress_obj.step_index = step_index
        progress_obj.completed = True
        progress_obj.metadata = metadata
        progress_obj.save(update_fields=["step_index", "completed", "metadata", "updated_at"])

    return success_response(
        data=_serialize_progress(progress_obj),
        message="Module marked as completed",
        status_code=201 if created else 200,
    )
