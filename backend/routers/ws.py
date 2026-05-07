import json
import asyncio
import base64
from fastapi import APIRouter, WebSocket, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.session import InterviewSession
from models.user import User
from database import async_session, get_db
from services.visual_analyzer import analyze_visual_frame
from services.audio_analyzer import analyze_audio_frame
from utils.auth import verify_token

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/interview")
async def websocket_interview(
    websocket: WebSocket,
    sessionId: str = Query(...),
    token: str = Query(...),
):
    await websocket.accept()

    try:
        token_data = verify_token(token)
        user_id = token_data["user_id"]
    except Exception as e:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    async with async_session() as db:
        result = await db.execute(
            select(InterviewSession).where(InterviewSession.id == sessionId)
        )
        session = result.scalar_one_or_none()

        if not session or session.user_id != user_id:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

    frame_buffer = []
    last_process_time = 0
    process_interval = 0.5

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "frame":
                video_b64 = message.get("video", "")
                audio_b64 = message.get("audio", "")

                if video_b64:
                    try:
                        video_bytes = base64.b64decode(video_b64)
                        frame_buffer.append({"video": video_bytes, "audio": audio_b64})
                    except Exception:
                        pass

                current_time = asyncio.get_event_loop().time()
                if (current_time - last_process_time) >= process_interval and frame_buffer:
                    last_process_time = current_time

                    latest_frame = frame_buffer[-1]
                    frame_buffer = []

                    visual_scores = await analyze_visual_frame(latest_frame["video"])

                    audio_scores = {}
                    if latest_frame["audio"]:
                        try:
                            audio_bytes = base64.b64decode(latest_frame["audio"])
                            audio_scores = await analyze_audio_frame(audio_bytes)
                        except Exception:
                            audio_scores = {
                                "tone": "Neutral",
                                "pitchVariation": 50,
                                "speechClarity": 75,
                                "speakingPace": 150,
                            }

                    metrics = {
                        "visualScores": visual_scores,
                        "audioScores": audio_scores,
                        "technicalScores": {
                            "correctness": 0,
                            "completeness": 0,
                            "depth": 0,
                        },
                    }

                    await websocket.send_text(json.dumps(metrics))

    except Exception as e:
        pass
    finally:
        await websocket.close()
