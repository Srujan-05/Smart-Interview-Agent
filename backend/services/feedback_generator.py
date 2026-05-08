from typing import Dict, List, Any


async def generate_session_feedback(
    session_data: Dict[str, Any], profile_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate comprehensive feedback for an interview session.
    Placeholder: will integrate with LLM when configured.
    """
    overall_score = 72.0

    breakdown = {
        "technicalCorrectness": 75,
        "communication": 70,
        "visualPresence": 72,
        "audioQuality": 68,
        "overall": overall_score,
    }

    per_question_feedback = []
    for i, answer in enumerate(session_data.get("answers", [])[:3]):
        per_question_feedback.append({
            "questionId": answer.get("questionId", f"q{i}"),
            "questionText": f"Question {i+1}",
            "yourAnswer": answer.get("transcription", "")[:100],
            "expectedAnswer": "Expected answer placeholder",
            "score": 72.0,
            "feedback": "Good answer with room for improvement in depth.",
            "tips": [
                "Expand your answer with more specific examples",
                "Focus on the 'why' behind your approach",
            ],
        })

    recommendations = {
        "topAreasToImprove": [
            "Technical depth in your answers",
            "Speaking pace and clarity",
            "Eye contact and body language",
        ],
        "personalizedTips": [
            "Practice explaining complex concepts in simple terms",
            "Record yourself answering questions to improve delivery",
            "Focus on confidence and pacing in your responses",
        ],
        "suggestedTopics": [
            "System design patterns",
            "Advanced Python concepts",
            "Communication skills",
        ],
        "nextSessionRecommendation": "Practice technical questions at a medium difficulty level",
    }

    return {
        "overallScore": overall_score,
        "breakdown": breakdown,
        "perQuestionFeedback": per_question_feedback,
        "recommendations": recommendations,
        "appliedStrategy": {
            "mode": "fixed",
            "difficulty": "Medium",
            "description": "Standard fixed-difficulty interview session.",
            "focusAreas": [],
        },
    }
