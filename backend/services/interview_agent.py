import uuid
from typing import List, Dict, Any


def select_strategy(training_profile: Dict[str, Any]) -> str:
    """Select questioning strategy based on training profile."""
    historical_data = training_profile.get("historicalData", {})

    if not historical_data:
        return "moderate"

    scores = []
    for domain, data in historical_data.items():
        if isinstance(data, dict) and "avgScore" in data:
            scores.append(data["avgScore"])

    if not scores:
        return "moderate"

    avg = sum(scores) / len(scores)
    if avg > 75:
        return "hard_downscale"
    elif avg < 50:
        return "easy_upscale"
    else:
        return "moderate"


async def generate_questions(
    profile: Dict[str, Any],
    mode: str,
    difficulty: str,
    job_description: str = "",
) -> List[Dict[str, Any]]:
    """
    Generate interview questions based on profile and mode.
    Currently returns stub questions; will integrate with LLM.
    """
    questions = []

    if mode == "Technical" or mode == "Mixed":
        questions.extend([
            {
                "id": str(uuid.uuid4()),
                "text": "Explain the concept of async/await in Python.",
                "type": "Technical",
                "difficulty": difficulty,
                "hint": "Think about how it relates to concurrency",
                "expectedAnswer": "Async/await allows writing concurrent code that looks sequential...",
            },
            {
                "id": str(uuid.uuid4()),
                "text": "What is the difference between == and is in Python?",
                "type": "Technical",
                "difficulty": difficulty,
                "hint": "One checks value equality, the other checks object identity",
                "expectedAnswer": "== compares values, is compares object identity",
            },
        ])

    if mode == "Behavioral" or mode == "Mixed" or mode == "Mock":
        questions.extend([
            {
                "id": str(uuid.uuid4()),
                "text": "Tell me about a time you had to handle a difficult team member.",
                "type": "Behavioral",
                "difficulty": difficulty,
                "hint": "Use the STAR method: Situation, Task, Action, Result",
                "expectedAnswer": "A good answer will describe a specific situation and positive resolution",
            },
            {
                "id": str(uuid.uuid4()),
                "text": "What's your greatest weakness and how do you address it?",
                "type": "Behavioral",
                "difficulty": difficulty,
                "hint": "Choose a real weakness and show how you're improving",
                "expectedAnswer": "Honesty about weaknesses with concrete improvement steps",
            },
        ])

    return questions[:8]


def adjust_difficulty(current: str, recent_scores: List[float]) -> str:
    """Adjust difficulty based on recent scores."""
    if len(recent_scores) < 3:
        return current

    if all(score > 80 for score in recent_scores):
        difficulty_order = ["Easy", "Medium", "Hard"]
        if current in difficulty_order:
            idx = difficulty_order.index(current)
            return difficulty_order[min(idx + 1, len(difficulty_order) - 1)]

    if any(score < 40 for score in recent_scores):
        difficulty_order = ["Easy", "Medium", "Hard"]
        if current in difficulty_order:
            idx = difficulty_order.index(current)
            return difficulty_order[max(idx - 1, 0)]

    return current
