# Capabilities Alignment

StadiumIQ was designed explicitly to fulfill the 4 primary capabilities of the Smart Stadiums & Tournament Operations track. 

This document maps each capability to its backend endpoint and its target persona.

| Capability Track | Endpoint | Method | Target Personas | Description |
| :--- | :--- | :---: | :--- | :--- |
| **Dynamic Crowd Management** | `/api/crowd` | `GET` | Organizers | Provides a list of stadium zones with their current density, queue times, and flow trends. Used to populate the Organizer Dashboard heatmaps. |
| **Smart Indoor Navigation** | `/api/decision` | `POST` | Fans, Volunteers | Analyzes current location and crowd metrics to generate an accessibility-aware path avoiding congested areas. |
| **Real-Time Decision Support** | `/api/decision` | `POST` | Staff, Organizers | AI-driven incident triage. Generates structured JSON dispatch orders containing risk scores, recommended actions, and volunteer deployment strategies. |
| **Multi-Language Assistance Modules** | `/api/multilingual-assist` | `POST` | Fans, Staff | A dedicated translation and localization engine. Handles context-aware translation of fan queries and PA announcements. |

## Additional Operational Endpoints

Beyond the core challenge requirements, StadiumIQ offers these complementary features:

| Feature | Endpoint | Description |
| :--- | :--- | :--- |
| **Sustainability & Transport** | `/api/sustainability` | Calculates carbon footprints for travel to the stadium and offers greener alternatives. |
| **Volunteer Briefings** | `/api/briefing` | Generates dynamic shift briefings based on the volunteer's assigned role and location. |
| **Fan Assistant Q&A** | `/api/chat` | A conversational agent that answers general stadium queries and helps with match-day itineraries. |
| **PA Announcements** | `/api/announce` | Translates a single PA announcement into a matrix of different target languages. |
