import json
import re
import subprocess
from pathlib import Path

from django.core.management.base import BaseCommand

from chatbot.models import ChatbotKnowledgeEntry, LessonSolution


def _infer_category(keywords: list[str]) -> str:
    lower = " ".join(keywords).lower()
    if any(k in lower for k in ["calculator", "projection", "pagibig", "mp2", "tbill", "reit", "real estate"]):
        return ChatbotKnowledgeEntry.CATEGORY_CALCULATOR
    if any(k in lower for k in ["simulation", "module", "lesson", "gas", "mempool", "wallet", "defi", "blockchain"]):
        return ChatbotKnowledgeEntry.CATEGORY_LEARNING
    if any(k in lower for k in ["where", "how to use", "navigate", "start"]):
        return ChatbotKnowledgeEntry.CATEGORY_PLATFORM
    if any(k in lower for k in ["scam", "phishing", "tax", "support"]):
        return ChatbotKnowledgeEntry.CATEGORY_SUPPORT
    return ChatbotKnowledgeEntry.CATEGORY_GENERAL


def parse_response_bank(frontend_root: Path) -> list[dict]:
    source_path = frontend_root / "src/context/ChatbotContext.jsx"
    source = source_path.read_text(encoding="utf-8")

    bank_match = re.search(r"const RESPONSE_BANK = \[(.*?)\]\n\n// fallback", source, re.DOTALL)
    if not bank_match:
        raise ValueError("Could not locate RESPONSE_BANK in ChatbotContext.jsx")

    block = bank_match.group(1)
    item_pattern = re.compile(
        r"\{\s*keywords:\s*\[(?P<keywords>.*?)\],\s*text:\s*\"(?P<text>(?:\\.|[^\"])*)\",\s*\}",
        re.DOTALL,
    )

    entries = []
    for index, match in enumerate(item_pattern.finditer(block), start=1):
        keywords_raw = match.group("keywords")
        text_raw = match.group("text")
        keywords = re.findall(r"'([^']+)'", keywords_raw)
        text = bytes(text_raw, "utf-8").decode("unicode_escape")
        entries.append(
            {
                "prompt_key": f"frontend-response-{index:03d}",
                "keywords": keywords,
                "answer_text": text,
                "category": _infer_category(keywords),
                "source_ref": str(source_path),
            }
        )

    return entries


def parse_simulation_modules(frontend_root: Path) -> list[dict]:
    source_path = frontend_root / "src/data/simulationData.js"
    script = (
        "import { MODULES } from "
        + json.dumps(source_path.as_uri())
        + ";\n"
        + "console.log(JSON.stringify(MODULES));"
    )
    completed = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        check=True,
        capture_output=True,
        text=True,
    )
    modules = json.loads(completed.stdout)

    rows = []
    for module_key, module in modules.items():
        for step in module.get("steps", []):
            solution_map = {}
            for item in step.get("items", []):
                item_id = item.get("id")
                correct_zone = item.get("correctZone")
                if item_id and correct_zone:
                    solution_map[item_id] = correct_zone

            rows.append(
                {
                    "module_key": module_key,
                    "step_id": step.get("id", ""),
                    "step_title": step.get("title", ""),
                    "instruction": step.get("instruction", ""),
                    "solution_map": solution_map,
                    "items": step.get("items", []),
                    "zones": step.get("zones", []),
                    "explanations": step.get("explanations", {}),
                    "source_ref": str(source_path),
                }
            )
    return rows


class Command(BaseCommand):
    help = "Seed chatbot knowledge base and lesson solutions from frontend sources"

    def handle(self, *args, **options):
        backend_root = Path(__file__).resolve().parents[3]
        frontend_root = backend_root.parent / "Frontend"

        kb_entries = parse_response_bank(frontend_root)
        lesson_rows = parse_simulation_modules(frontend_root)

        for entry in kb_entries:
            ChatbotKnowledgeEntry.objects.update_or_create(
                prompt_key=entry["prompt_key"],
                defaults={
                    "keywords": entry["keywords"],
                    "answer_text": entry["answer_text"],
                    "category": entry["category"],
                    "source_ref": entry["source_ref"],
                    "is_active": True,
                },
            )

        for row in lesson_rows:
            LessonSolution.objects.update_or_create(
                module_key=row["module_key"],
                step_id=row["step_id"],
                defaults={
                    "step_title": row["step_title"],
                    "instruction": row["instruction"],
                    "solution_map": row["solution_map"],
                    "items": row["items"],
                    "zones": row["zones"],
                    "explanations": row["explanations"],
                    "source_ref": row["source_ref"],
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(kb_entries)} knowledge entries and {len(lesson_rows)} lesson solutions"
            )
        )
