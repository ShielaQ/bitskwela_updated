import json
import os
import re
from typing import Any

from .models import ChatbotKnowledgeEntry, LessonSolution

SOLUTION_SEEKING_PATTERNS = [
    "give me the answer",
    "give the answer",
    "exact answer",
    "correct answer",
    "what is the correct",
    "what is the right",
    "correct zone",
    "solution",
    "just tell me",
]


def is_solution_seeking(message: str) -> bool:
    lower = (message or "").lower()
    return any(pattern in lower for pattern in SOLUTION_SEEKING_PATTERNS)


def _intent_category(intent: str) -> str:
    mapping = {
        "calculator_assistance": ChatbotKnowledgeEntry.CATEGORY_CALCULATOR,
        "platform_navigation": ChatbotKnowledgeEntry.CATEGORY_PLATFORM,
        "learning_assistance": ChatbotKnowledgeEntry.CATEGORY_LEARNING,
    }
    return mapping.get(intent, ChatbotKnowledgeEntry.CATEGORY_GENERAL)


def _keyword_overlap_score(message: str, keywords: list[str]) -> int:
    lower = (message or "").lower()
    return sum(1 for keyword in keywords if keyword and keyword.lower() in lower)


def _fetch_kb_context(message: str, intent: str, limit: int = 8) -> list[dict[str, Any]]:
    category = _intent_category(intent)
    entries = list(
        ChatbotKnowledgeEntry.objects.filter(is_active=True, category=category).values(
            "prompt_key", "keywords", "answer_text", "category", "source_ref"
        )
    )
    if not entries:
        entries = list(
            ChatbotKnowledgeEntry.objects.filter(is_active=True).values(
                "prompt_key", "keywords", "answer_text", "category", "source_ref"
            )
        )

    ranked = []
    for entry in entries:
        score = _keyword_overlap_score(message, entry.get("keywords") or [])
        ranked.append((score, entry))

    ranked.sort(key=lambda x: x[0], reverse=True)
    selected = [entry for score, entry in ranked if score > 0][:limit]

    if not selected:
        selected = [entry for _score, entry in ranked[: min(limit, len(ranked))]]

    return selected


def _extract_lesson_context(context: dict[str, Any]) -> tuple[str | None, str | None]:
    module_key = context.get("module_key") or context.get("module")
    step_id = context.get("step_id") or context.get("lesson_step_id")
    return module_key, step_id


def _fetch_lesson_solution(context: dict[str, Any]) -> dict[str, Any] | None:
    module_key, step_id = _extract_lesson_context(context)
    if not module_key or not step_id:
        return None

    record = (
        LessonSolution.objects.filter(module_key=module_key, step_id=step_id)
        .values(
            "module_key",
            "step_id",
            "step_title",
            "instruction",
            "solution_map",
            "items",
            "zones",
            "explanations",
            "source_ref",
        )
        .first()
    )
    return record


def _system_rules(solution_seeking: bool) -> str:
    base_rules = [
        "You are Bitskwela's learning support assistant for a Web3 learning platform.",
        "Priorities: 1) learner safety, 2) conceptual understanding, 3) platform support.",
        "Always use Socratic teaching when the user is working on lessons: ask guiding questions, offer tiered hints, and encourage reasoning.",
        "Never provide the full final answer mapping for lesson exercises.",
        "If the learner asks directly for the answer, refuse politely and give the smallest useful hint plus one reflective question.",
        "Use the instructor solution internally only to validate hints and reduce hallucinations.",
        "For support/platform questions, provide direct concise steps.",
        "Do not invent product features, routes, or lesson mechanics not present in provided context.",
    ]
    if solution_seeking:
        base_rules.append(
            "The current user message appears answer-seeking. Enforce strict no-answer behavior and provide Socratic hints only."
        )
    return "\n".join(f"- {rule}" for rule in base_rules)


def build_chat_prompt_context(*, message: str, intent: str, context: dict[str, Any] | None) -> dict[str, Any]:
    safe_context = context or {}
    solution_seeking = is_solution_seeking(message)
    kb_entries = _fetch_kb_context(message, intent=intent)
    lesson_solution = _fetch_lesson_solution(safe_context)

    prompt_context = {
        "intent": intent,
        "user_context": safe_context,
        "knowledge_base": kb_entries,
        "lesson_solution": lesson_solution,
        "answer_guard": {
            "solution_seeking": solution_seeking,
            "policy": "Do not provide full answer mappings; use Socratic hints.",
        },
    }

    return {
        "system": _system_rules(solution_seeking),
        "context": prompt_context,
    }


def serialize_prompt_context(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False)
