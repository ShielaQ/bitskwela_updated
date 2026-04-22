from rest_framework.throttling import UserRateThrottle


class CalculateRateThrottle(UserRateThrottle):
    scope = "calculate"


class ChatRateThrottle(UserRateThrottle):
    scope = "chat"
