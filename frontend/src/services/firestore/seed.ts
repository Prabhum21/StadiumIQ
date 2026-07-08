import { db } from "@/lib/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { Venue, CrowdData, TransportData, FoodVendor, Volunteer, Incident, Alert } from "@/types";

export const seedDatabaseIfEmpty = async () => {
  try {
    const venuesRef = collection(db, "venues");
    const snapshot = await getDocs(venuesRef);
    
    if (!snapshot.empty) {
      return;
    }
    
    // Seeding database with realistic mock data...

    // 1. Seed Venue
    const lusailVenue: Venue = {
      name: "Lusail Stadium",
      capacity: 88000,
      gates: ["Gate A", "Gate B", "Gate C", "Gate D"],
      sections: ["North", "South", "East", "West"],
      foodCourts: ["Food Court A", "Food Court B", "Food Court C"],
      medicalCenters: ["Medical Room A", "Medical Room B"],
      parking: ["P1", "P2", "P3"],
      emergencyExits: ["Exit 1", "Exit 2", "Exit 3"]
    };
    await setDoc(doc(db, "venues", "lusail-stadium"), lusailVenue);

    // 2. Seed Crowd Data
    const crowdData: CrowdData[] = [
      { locationId: "Gate A", peopleCount: 420, density: "Medium", queueTime: 6, timestamp: Date.now() },
      { locationId: "Gate B", peopleCount: 1320, density: "High", queueTime: 18, timestamp: Date.now() },
      { locationId: "Gate C", peopleCount: 250, density: "Low", queueTime: 2, timestamp: Date.now() }
    ];
    for (const c of crowdData) {
      await setDoc(doc(collection(db, "crowd")), c);
    }

    // 3. Seed Transport Data
    const transportData: TransportData[] = [
      { type: "Parking", status: "Filling", occupancy: 85, timestamp: Date.now() },
      { type: "Metro", status: "On Time", availability: "Medium", timestamp: Date.now() },
      { type: "Bus", status: "Delayed", availability: "Low", timestamp: Date.now() }
    ];
    for (const t of transportData) {
      await setDoc(doc(collection(db, "transport")), t);
    }

    // 4. Seed Food Data
    const foodData: FoodVendor[] = [
      { name: "Pizza Hub", category: "Pizza", queueLength: 15, estimatedWait: 10, availability: "Open" },
      { name: "Burger Corner", category: "Burgers", queueLength: 35, estimatedWait: 20, availability: "Busy" },
      { name: "Coffee Express", category: "Beverages", queueLength: 5, estimatedWait: 2, availability: "Open" },
      { name: "Healthy Bites", category: "Salads", queueLength: 0, estimatedWait: 0, availability: "Closed" }
    ];
    for (const f of foodData) {
      await setDoc(doc(collection(db, "food")), f);
    }

    // 5. Seed Volunteers
    const volunteerData: Volunteer[] = [
      { name: "Ahmed Khan", role: "Steward", status: "Active", currentLocation: "Gate B", availability: "Busy" },
      { name: "Maria Garcia", role: "Medical", status: "Active", currentLocation: "Medical Room A", availability: "Available" }
    ];
    for (const v of volunteerData) {
      await setDoc(doc(collection(db, "volunteers")), v);
    }

    // 6. Seed Incidents
    const incidentData: Incident[] = [
      { type: "Medical", priority: "High", status: "In Progress", location: "Section North", timestamp: Date.now() },
      { type: "Lost Child", priority: "Critical", status: "Open", location: "Gate A", timestamp: Date.now() },
      { type: "Security", priority: "Medium", status: "Resolved", location: "Food Court B", timestamp: Date.now() }
    ];
    for (const i of incidentData) {
      await setDoc(doc(collection(db, "incidents")), i);
    }

    // 7. Seed Alerts
    const alertData: Alert[] = [
      { type: "Transport", message: "Metro Line Red is delayed by 10 mins.", timestamp: Date.now(), active: true }
    ];
    for (const a of alertData) {
      await setDoc(doc(collection(db, "alerts")), a);
    }

    // Database seeded successfully.
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
