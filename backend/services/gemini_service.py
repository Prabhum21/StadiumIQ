import os
import json
import asyncio
import logging
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

class GeminiService:
    def __init__(self):
        self.model_name = "gemini-2.5-flash"
        self._client = None

    def get_client(self):
        if not self._client:
            self._client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        return self._client

    async def get_decision_recommendation(self, context_data: dict) -> dict:
        """
        Uses Gemini to generate structured JSON recommendations based on context.
        """
        mode = context_data.get("mode", "navigation")
        
        if mode == "operations":
            prompt = f"""
            You are the StadiumIQ AI Decision Engine for the FIFA World Cup 2026 Operations Center.
            Analyze the following context and provide operational recommendations for organizers.
            
            Context:
            {json.dumps(context_data, indent=2)}
            
            Provide the output in JSON format exactly matching this schema:
            {{
              "overall_status": "Operational, Warning, or Critical",
              "risk_score": 34,
              "priority": "Low, Medium, High, or Critical",
              "recommended_actions": ["Deploy volunteers", "Open Gate D", "Redirect spectators"],
              "predicted_problems": ["Expected congestion", "Volunteer shortage"],
              "volunteer_deployment": ["Deploy 2 to Gate B", "Move Medical to North Stand"],
              "executive_summary": "A 2-sentence summary of the stadium status."
            }}
            """
            fallback = {
                "overall_status": "Critical",
                "risk_score": 100,
                "priority": "Critical",
                "recommended_actions": ["Escalate to manual operations.", "Restart AI system."],
                "predicted_problems": ["AI Failure"],
                "volunteer_deployment": ["Maintain current posts"],
                "executive_summary": "AI Decision Engine is currently offline. Rely on manual protocols."
            }
        elif mode == "emergency":
            prompt = f"""
            You are the StadiumIQ AI Emergency Command Center.
            Analyze the following emergency context (including Crowd Density, Medical Resources, Volunteer Distance, Accessibility, Queue) and dispatch the best volunteers.
            
            Context:
            {json.dumps(context_data, indent=2)}
            
            Provide the output in JSON format exactly matching this schema:
            {{
              "priority": "Low, Medium, High, or Critical",
              "assigned_volunteers": ["Volunteer A", "Volunteer B"],
              "estimated_response": "3 min",
              "recommended_actions": ["Action 1", "Action 2"],
              "medical_support": true,
              "evacuation_required": false,
              "reasoning": ["Reason 1", "Reason 2"]
            }}
            """
            fallback = {
              "priority": "Critical",
              "assigned_volunteers": [],
              "estimated_response": "N/A",
              "recommended_actions": ["Manual Dispatch Required immediately due to AI offline."],
              "medical_support": True,
              "evacuation_required": False,
              "reasoning": ["AI Failure. Proceed with fallback protocol."]
            }
        elif mode == "accessibility":
            prompt = f"""
            You are the StadiumIQ AI Accessibility Assistant for the FIFA World Cup 2026.
            Analyze the following context (including the user's specific accessibility profile) and provide tailored route recommendations.
            
            Context:
            {json.dumps(context_data, indent=2)}
            
            Provide the output in JSON format exactly matching this schema:
            {{
              "recommended_route": ["Point A", "Point B"],
              "estimated_time": "10 min",
              "accessible_facilities": ["Elevator 3", "Accessible Toilet Near Gate B"],
              "rest_areas": ["Rest Area North"],
              "warnings": ["High crowd at Gate B"],
              "reasoning": ["Avoided Gate B due to crowd", "Used Elevator 3 for wheelchair access"]
            }}
            """
            fallback = {
              "recommended_route": [],
              "estimated_time": "N/A",
              "accessible_facilities": [],
              "rest_areas": [],
              "warnings": ["AI Offline. Please ask a volunteer for accessible routing."],
              "reasoning": ["API Failure"]
            }
        elif mode == "transport":
            prompt = f"""
            You are the StadiumIQ AI Transport Assistant.
            Analyze the following live transport context (Metro status, Parking occupancy, etc.) and user preferences to recommend travel options.
            
            Context:
            {json.dumps(context_data, indent=2)}
            
            Provide the output in JSON format exactly matching this schema:
            {{
              "recommended_mode": "Metro / Taxi / Bus / Parking",
              "travel_time": "25 min",
              "cost_estimate": "$2.50",
              "parking_advice": "Park at P2 (85% full)",
              "reasoning": ["Metro Red Line is delayed, taking Bus is faster", "P1 is full"]
            }}
            """
            fallback = {
              "recommended_mode": "Unknown",
              "travel_time": "N/A",
              "cost_estimate": "N/A",
              "parking_advice": "No live data available.",
              "reasoning": ["AI Offline. Please follow static signage."]
            }
        else:
            prompt = f"""
            You are the StadiumIQ AI Decision Engine for the FIFA World Cup 2026.
            Analyze the following context and provide operational and navigation recommendations.
            
            Context:
            {json.dumps(context_data, indent=2)}
            
            Provide the output in JSON format exactly matching this schema:
            {{
              "recommended_route": ["Location A", "Location B", "Location C"],
              "estimated_time": "Time string e.g. 7 min",
              "crowd_level": "Low, Medium, High, or Critical",
              "risk_score": 18,
              "recommended_food_stop": "Name of food stop or null",
              "accessibility_notes": ["Note 1", "Note 2"],
              "alternative_route": ["Alt A", "Alt B"],
              "reasoning": "Explain why this route was chosen."
            }}
            """
            fallback = {
                "recommended_route": [],
                "estimated_time": "N/A",
                "crowd_level": "High",
                "risk_score": 100,
                "recommended_food_stop": None,
                "accessibility_notes": [],
                "alternative_route": [],
                "reasoning": "Fallback: Escalate to manual review due to API failure."
            }
        
        
        logger = logging.getLogger("gemini_service")
        
        max_retries = 2
        base_delay = 1

        for attempt in range(max_retries + 1):
            try:
                client = self.get_client()
                response = await client.aio.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.2,
                    ),
                )
                
                # Validate JSON before returning
                data = json.loads(response.text)
                if not isinstance(data, dict):
                    raise ValueError("AI Response is not a JSON object")
                
                # Sanitize response to prevent XSS (replace < and > in string values)
                def sanitize(obj):
                    if isinstance(obj, str):
                        return obj.replace("<", "&lt;").replace(">", "&gt;")
                    elif isinstance(obj, dict):
                        return {k: sanitize(v) for k, v in obj.items()}
                    elif isinstance(obj, list):
                        return [sanitize(item) for item in obj]
                    return obj
                    
                return sanitize(data)
            except Exception as e:
                logger.error(f"Gemini API Error (Attempt {attempt + 1}/{max_retries + 1}): {e}")
                if attempt < max_retries:
                    await asyncio.sleep(base_delay * (2 ** attempt))
                else:
                    logger.error("Max retries reached. Returning graceful fallback JSON.")
                    return fallback

    async def get_fan_assistant_response(self, query: str, user_profile: dict) -> str:
        prompt = f"""
        You are the StadiumIQ Fan Assistant.
        User Profile: {json.dumps(user_profile)}
        Query: {query}
        
        Provide a helpful, concise, and localized response taking into account their accessibility needs and current location.
        """
        
        logger = logging.getLogger("gemini_service")
        max_retries = 2
        base_delay = 1

        for attempt in range(max_retries + 1):
            try:
                client = self.get_client()
                response = await client.aio.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                
                # Sanitize response
                sanitized_text = response.text.replace("<", "&lt;").replace(">", "&gt;")
                return sanitized_text
            except Exception as e:
                logger.error(f"Gemini API Error (Fan Assistant - Attempt {attempt + 1}/{max_retries + 1}): {e}")
                if attempt < max_retries:
                    await asyncio.sleep(base_delay * (2 ** attempt))
                else:
                    logger.error("Max retries reached. Returning graceful fallback text.")
                    return "I am currently experiencing connection issues. Please locate the nearest volunteer for assistance."
