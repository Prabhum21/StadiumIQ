"""
Prompt templates and fallbacks for the StadiumIQ Gemini integration.
"""


def get_decision_prompt_and_fallback(mode: str, context_str: str) -> tuple[str, dict]:
    prompts = {
        "operations": (
            f"You are the StadiumIQ AI Decision Engine for the FIFA World Cup 2026 Operations Center.\n"
            f"Analyze the following context and provide operational recommendations for organizers.\n"
            f"Context:\n{context_str}\n\n"
            f"Provide the output in JSON format matching the schema for Operations."
        ),
        "emergency": (
            f"You are the StadiumIQ AI Emergency Command Center.\n"
            f"Analyze the emergency context and dispatch the best volunteers.\n"
            f"Context:\n{context_str}\n\n"
            f"Provide the output in JSON format matching the schema for Emergency."
        ),
        "accessibility": (
            f"You are the StadiumIQ AI Accessibility Assistant for the FIFA World Cup 2026.\n"
            f"Analyze the context and provide tailored route recommendations.\n"
            f"Context:\n{context_str}\n"
        ),
        "transport": (
            f"You are the StadiumIQ AI Transport Assistant.\n"
            f"Analyze the live transport context and recommend travel options.\n"
            f"Context:\n{context_str}\n"
        ),
        "default": (
            f"You are the StadiumIQ AI Decision Engine for the FIFA World Cup 2026.\n"
            f"Analyze the context and provide operational and navigation recommendations.\n"
            f"Context:\n{context_str}\n"
        ),
    }

    fallbacks = {
        "operations": {
            "overall_status": "Critical",
            "risk_score": 100,
            "priority": "Critical",
            "recommended_actions": ["Escalate to manual operations.", "Restart AI system."],
            "predicted_problems": ["AI Failure"],
            "volunteer_deployment": ["Maintain current posts"],
            "executive_summary": "AI Decision Engine is currently offline. Rely on manual protocols.",
        },
        "emergency": {
            "priority": "Critical",
            "assigned_volunteers": [],
            "estimated_response": "N/A",
            "recommended_actions": ["Manual Dispatch Required immediately due to AI offline."],
            "medical_support": True,
            "evacuation_required": False,
            "reasoning": ["AI Failure. Proceed with fallback protocol."],
        },
        "accessibility": {
            "recommended_route": [],
            "estimated_time": "N/A",
            "accessible_facilities": [],
            "rest_areas": [],
            "warnings": ["AI Offline. Please ask a volunteer for accessible routing."],
            "reasoning": ["API Failure"],
        },
        "transport": {
            "recommended_mode": "Unknown",
            "travel_time": "N/A",
            "cost_estimate": "N/A",
            "parking_advice": "No live data available.",
            "reasoning": ["AI Offline. Please follow static signage."],
        },
        "default": {
            "recommended_route": [],
            "estimated_time": "N/A",
            "crowd_level": "High",
            "risk_score": 100,
            "recommended_food_stop": None,
            "accessibility_notes": [],
            "alternative_route": [],
            "reasoning": "Fallback: Escalate to manual review due to API failure.",
        },
    }

    return prompts.get(mode, prompts["default"]), fallbacks.get(mode, fallbacks["default"])
