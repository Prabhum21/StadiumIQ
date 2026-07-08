export interface Venue {
  id?: string;
  name: string;
  capacity: number;
  gates: string[];
  sections: string[];
  foodCourts: string[];
  medicalCenters: string[];
  parking: string[];
  emergencyExits: string[];
}

export interface CrowdData {
  id?: string;
  locationId: string; // e.g. "Gate A"
  peopleCount: number;
  density: 'Low' | 'Medium' | 'High';
  queueTime: number; // minutes
  timestamp: number;
}

export interface TransportData {
  id?: string;
  type: 'Parking' | 'Metro' | 'Bus' | 'Taxi' | 'Ride Share' | 'Walking';
  status: string;
  occupancy?: number; // percentage
  availability?: 'Low' | 'Medium' | 'High';
  timestamp: number;
}

export interface FoodVendor {
  id?: string;
  name: string;
  category: string;
  queueLength: number;
  estimatedWait: number; // minutes
  availability: 'Open' | 'Closed' | 'Busy';
}

export interface Volunteer {
  id?: string;
  name: string;
  role: string;
  status: 'Active' | 'Break' | 'Offline' | 'Responding';
  currentLocation: string;
  assignedIncident?: string | null;
  availability: 'Available' | 'Busy';
  skill?: string[];
  medicalCertification?: boolean;
}

export interface Incident {
  id?: string;
  type:
    | 'Medical'
    | 'Lost Child'
    | 'Fire'
    | 'Security'
    | 'Crowd Surge'
    | 'Suspicious Object'
    | 'Accessibility Assistance';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedVolunteer?: string | null;
  location: string;
  description?: string;
  reporterRole?: string;
  timestamp: number;
}

export interface Alert {
  id?: string;
  type: 'Emergency' | 'Weather' | 'Transport' | 'Security' | 'Gate' | 'Information';
  message: string;
  timestamp: number;
  active: boolean;
}

export interface RouteData {
  id?: string;
  source: string;
  destination: string;
  walkingTime: number; // minutes
  accessibility: boolean;
  crowdRisk: 'Low' | 'Medium' | 'High';
  alternativeRoute?: string[];
}

export interface OperationsResult {
  mode: 'operations';
  overall_status: string;
  risk_score: number;
  priority: string;
  recommended_actions: string[];
  predicted_problems: string[];
  volunteer_deployment: string[];
  executive_summary: string;
}

export interface EmergencyResult {
  mode: 'emergency';
  priority: string;
  assigned_volunteers: string[];
  estimated_response: string;
  recommended_actions: string[];
  medical_support: boolean;
  evacuation_required: boolean;
  reasoning: string[];
}

export interface AccessibilityResult {
  mode: 'accessibility';
  recommended_route: string[];
  estimated_time: string;
  accessible_facilities: string[];
  rest_areas: string[];
  warnings: string[];
  reasoning: string[];
}

export interface TransportResult {
  mode: 'transport';
  recommended_mode: string;
  travel_time: string;
  cost_estimate: string;
  parking_advice: string;
  reasoning: string[];
}

export interface DefaultResult {
  mode: 'default';
  recommended_route: string[];
  estimated_time: string;
  crowd_level: string;
  risk_score: number;
  recommended_food_stop: string | null;
  accessibility_notes: string[];
  alternative_route: string[];
  reasoning: string | string[];
}

export type AIAnalysisResponse =
  OperationsResult | EmergencyResult | AccessibilityResult | TransportResult | DefaultResult;
