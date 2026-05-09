from typing import Dict, List, Any


async def generate_session_feedback(
    session_data: Dict[str, Any], profile_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate comprehensive feedback for an interview session.
    Computes scores from collected visual/audio metrics.
    """
    answers = session_data.get("answers", [])

    # Aggregate metrics across all answers
    visual_scores = {"eyeContact": [], "engagement": [], "stress": []}
    audio_scores = {"tone_confident": 0, "pitch": [], "clarity": [], "pace": []}
    technical_scores = {"correctness": [], "completeness": [], "depth": []}

    for answer in answers:
        metrics = answer.get("metrics", {})
        visual = metrics.get("visualScores", {})
        audio = metrics.get("audioScores", {})
        technical = metrics.get("technicalScores", {})

        if visual.get("eyeContact"):
            visual_scores["eyeContact"].append(visual["eyeContact"])
        if visual.get("engagementLevel"):
            visual_scores["engagement"].append(visual["engagementLevel"])
        if visual.get("stressLevel") is not None:
            visual_scores["stress"].append(visual["stressLevel"])

        if audio.get("pitchVariation"):
            audio_scores["pitch"].append(audio["pitchVariation"])
        if audio.get("speechClarity"):
            audio_scores["clarity"].append(audio["speechClarity"])
        if audio.get("speakingPace"):
            audio_scores["pace"].append(audio["speakingPace"])
        if audio.get("tone") == "Confident":
            audio_scores["tone_confident"] += 1

        if technical.get("correctness"):
            technical_scores["correctness"].append(technical["correctness"])
        if technical.get("completeness"):
            technical_scores["completeness"].append(technical["completeness"])
        if technical.get("depth"):
            technical_scores["depth"].append(technical["depth"])

    # Compute averages
    def avg(lst):
        return sum(lst) / len(lst) if lst else 0

    visual_presence = (
        (avg(visual_scores["eyeContact"]) * 0.5 +
         avg(visual_scores["engagement"]) * 0.3 -
         avg(visual_scores["stress"]) * 0.2) / 3 * 100
    )
    visual_presence = max(0, min(100, visual_presence))

    audio_quality = (
        avg(audio_scores["pitch"]) * 0.3 +
        avg(audio_scores["clarity"]) * 0.4 +
        (avg(audio_scores["pace"]) - 100) / 100 * 20 + 50 +
        (audio_scores["tone_confident"] / max(1, len(answers)) * 100) * 0.1
    )
    audio_quality = max(0, min(100, audio_quality))

    technical_correctness = avg(technical_scores["correctness"] or [50])
    communication = (audio_quality * 0.6 + visual_presence * 0.4)
    overall_score = (technical_correctness * 0.4 + communication * 0.6)
    overall_score = max(0, min(100, overall_score))

    breakdown = {
        "technicalCorrectness": int(technical_correctness),
        "communication": int(communication),
        "visualPresence": int(visual_presence),
        "audioQuality": int(audio_quality),
        "overall": int(overall_score),
    }

    per_question_feedback = []
    for i, answer in enumerate(answers[:3]):
        metrics = answer.get("metrics", {})
        visual = metrics.get("visualScores", {})
        audio = metrics.get("audioScores", {})
        q_score = (
            (visual.get("eyeContact", 50) * 0.3 +
             visual.get("engagementLevel", 50) * 0.2 +
             audio.get("speechClarity", 50) * 0.3 +
             audio.get("pitchVariation", 50) * 0.2) / 4 * 100
        )
        q_score = max(0, min(100, int(q_score)))

        per_question_feedback.append({
            "questionId": answer.get("questionId", f"q{i}"),
            "questionText": f"Question {i+1}",
            "yourAnswer": answer.get("transcription", "")[:100],
            "expectedAnswer": "Expected answer placeholder",
            "score": q_score,
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
