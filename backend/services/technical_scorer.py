from typing import Dict, Any


async def score_answer(
    question: str, expected_answer: str, user_answer: str
) -> Dict[str, Any]:
    """
    Score a user's answer for technical correctness.
    Placeholder: will integrate with BERTScore and LLM when configured.
    """
    if not user_answer or len(user_answer) < 10:
        return {
            "correctness": 20,
            "completeness": 10,
            "depth": 15,
        }

    answer_lower = user_answer.lower()
    expected_lower = expected_answer.lower() if expected_answer else ""

    common_words = set(answer_lower.split()) & set(expected_lower.split())
    similarity = len(common_words) / max(len(set(expected_lower.split())), 1) * 100

    completeness = min(100, max(0, similarity))
    correctness = min(100, max(0, similarity + 20))
    depth = min(100, max(0, len(user_answer) / 100 * 50 + 30))

    return {
        "correctness": int(correctness),
        "completeness": int(completeness),
        "depth": int(depth),
    }
