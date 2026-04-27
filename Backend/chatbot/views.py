from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.responses import error_response, success_response
from core.throttles import ChatRateThrottle

from .models import ChatConversation, ChatMessage
from .serializers import ChatHistoryQuerySerializer, ChatRequestSerializer
from .services import llm_first_chat_reply


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([ChatRateThrottle])
def chat(request):
    serializer = ChatRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return error_response(
            message="Invalid chat payload",
            error=serializer.errors,
            status_code=400,
        )

    message = serializer.validated_data["message"].strip()
    context = serializer.validated_data.get("context", {})
    conversation_id = serializer.validated_data.get("conversation_id")

    # Backward-compatible top-level context fields.
    for key in ["screen", "module_key", "step_id", "attempt_count", "placements"]:
        value = serializer.validated_data.get(key)
        if value is not None:
            context[key] = value

    is_authenticated = bool(getattr(request, "user", None)) and request.user.is_authenticated

    if conversation_id:
        if is_authenticated:
            conversation = ChatConversation.objects.filter(id=conversation_id, user=request.user).first()
        else:
            conversation = ChatConversation.objects.filter(id=conversation_id, user__isnull=True).first()
        if not conversation:
            return error_response(
                message="Conversation not found",
                error={"detail": "Invalid conversation_id for current user"},
                status_code=404,
            )
    else:
        conversation = ChatConversation.objects.create(
            user=(request.user if is_authenticated else None),
            title=(message[:80] if message else "New conversation"),
        )

    ChatMessage.objects.create(
        conversation=conversation,
        role=ChatMessage.ROLE_USER,
        content=message,
        metadata={"context": context},
    )

    reply_data = llm_first_chat_reply(message=message, context=context)

    bot_message = ChatMessage.objects.create(
        conversation=conversation,
        role=ChatMessage.ROLE_BOT,
        content=reply_data["reply"],
        metadata={
            "intent": reply_data["intent"],
            "degraded": reply_data["degraded"],
            "degradation_reason": reply_data["degradation_reason"],
            "provider_meta": reply_data["provider_meta"],
        },
    )

    return success_response(
        data={
            "conversation_id": conversation.id,
            "message_id": bot_message.id,
            "reply": bot_message.content,
            "intent": reply_data["intent"],
            "degraded": reply_data["degraded"],
            "degradation_reason": reply_data["degradation_reason"],
            "provider_meta": reply_data["provider_meta"],
        },
        message="Chat reply generated",
        status_code=201,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_history(request):
    serializer = ChatHistoryQuerySerializer(data=request.query_params)
    if not serializer.is_valid():
        return error_response(
            message="Invalid history query",
            error=serializer.errors,
            status_code=400,
        )

    conversation_id = serializer.validated_data.get("conversation_id")
    limit = serializer.validated_data.get("limit", 50)

    if conversation_id:
        conversations = ChatConversation.objects.filter(id=conversation_id, user=request.user).order_by("-created_at")
    else:
        conversations = ChatConversation.objects.filter(user=request.user).order_by("-created_at")[:10]

    data = []
    for conv in conversations:
        msg_queryset = conv.messages.order_by("-created_at")[:limit]
        messages = [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "metadata": msg.metadata,
                "created_at": msg.created_at.isoformat(),
            }
            for msg in reversed(list(msg_queryset))
        ]
        data.append(
            {
                "conversation_id": conv.id,
                "title": conv.title,
                "created_at": conv.created_at.isoformat(),
                "messages": messages,
            }
        )

    return success_response(
        data={
            "items": data,
            "count": len(data),
        },
        message="Chat history fetched",
    )
