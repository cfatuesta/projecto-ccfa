/**
 * Firestore Seed Data Script for Latin Run Club
 *
 * Run this ONCE to populate Firestore with sample data for development.
 *
 * Usage:
 *   1. Make sure your .env has the Firebase config variables
 *   2. Open the app in a browser
 *   3. Open the browser console
 *   4. Copy-paste this entire script OR import and call seedAll()
 *
 * Alternatively, you can run this from the browser by navigating to
 * /dashboard and running:  import('/src/scripts/seedData.js')
 */

import { db } from "../firebase/config";
import { collection, doc, setDoc, Timestamp, addDoc } from "firebase/firestore";

// ─── Helper: future date ────────────────────────────────────
function futureDate(daysFromNow, hour = 7, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return Timestamp.fromDate(d);
}

function pastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return Timestamp.fromDate(d);
}

// ─── Cities ─────────────────────────────────────────────────
const CITIES = {
  new_york: {
    name: "New York",
    description:
      "Running through the five boroughs. From Central Park loops to Brooklyn Bridge sunrises — NYC runs different.",
    memberCount: 45,
    photoURL: "",
  },
  washington_dc: {
    name: "Washington DC",
    description:
      "Monuments, memorials, and miles. The DC chapter runs the capital with pride and purpose.",
    memberCount: 32,
    photoURL: "",
  },
  boston: {
    name: "Boston",
    description:
      "From the Esplanade to the Marathon route. Boston runners bring that New England grit every week.",
    memberCount: 38,
    photoURL: "",
  },
  atlanta: {
    name: "Atlanta",
    description:
      "Running through the heart of the South. ATL brings the heat, the culture, and the community.",
    memberCount: 28,
    photoURL: "",
  },
  london: {
    name: "London",
    description:
      "From Hyde Park to the Thames Path. Our international chapter proving LRC has no borders.",
    memberCount: 22,
    photoURL: "",
  },
};

// ─── Sample Runs ────────────────────────────────────────────
const RUNS = [
  {
    id: "run_bos_1",
    city: "boston",
    date: futureDate(3, 7, 0),
    time: "7:00 AM",
    location: "Charles River Esplanade",
    paceGroup: "moderate",
    description: "Morning run along the Esplanade. All paces welcome!",
    rsvps: [],
    status: "upcoming",
  },
  {
    id: "run_bos_2",
    city: "boston",
    date: futureDate(10, 8, 0),
    time: "8:00 AM",
    location: "Boston Common → Fenway",
    paceGroup: "easy",
    description:
      "Scenic route through the city. 5K distance, beginner-friendly.",
    rsvps: [],
    status: "upcoming",
  },
  {
    id: "run_bos_3",
    city: "boston",
    date: futureDate(17, 6, 30),
    time: "6:30 AM",
    location: "Marathon Route (Heartbreak Hill)",
    paceGroup: "fast",
    description: "Training run on the Marathon course. Get those hills in!",
    rsvps: [],
    status: "upcoming",
  },
  {
    id: "run_ny_1",
    city: "new_york",
    date: futureDate(2, 6, 30),
    time: "6:30 AM",
    location: "Central Park — Full Loop",
    paceGroup: "moderate",
    description:
      "Classic Central Park loop. Meet at Engineers Gate (90th & 5th).",
    rsvps: [],
    status: "upcoming",
  },
  {
    id: "run_ny_2",
    city: "new_york",
    date: futureDate(9, 7, 0),
    time: "7:00 AM",
    location: "Brooklyn Bridge → DUMBO",
    paceGroup: "easy",
    description: "Sunrise run across the bridge. Photo ops included!",
    rsvps: [],
    status: "upcoming",
  },
  {
    id: "run_dc_1",
    city: "washington_dc",
    date: futureDate(4, 6, 0),
    time: "6:00 AM",
    location: "National Mall Loop",
    paceGroup: "moderate",
    description: "Run past the monuments at dawn. 10K route.",
    rsvps: [],
    status: "upcoming",
  },
  {
    id: "run_atl_1",
    city: "atlanta",
    date: futureDate(5, 7, 0),
    time: "7:00 AM",
    location: "Piedmont Park",
    paceGroup: "easy",
    description: "Weekend park run. Bring your energy!",
    rsvps: [],
    status: "upcoming",
  },
  {
    id: "run_lon_1",
    city: "london",
    date: futureDate(6, 7, 30),
    time: "7:30 AM",
    location: "Hyde Park — Serpentine Loop",
    paceGroup: "moderate",
    description: "Saturday morning run around the Serpentine.",
    rsvps: [],
    status: "upcoming",
  },
];

// ─── Sample Races ───────────────────────────────────────────
const RACES = [
  {
    id: "race_1",
    name: "Boston Marathon 2026",
    date: futureDate(45),
    distance: "Marathon",
    location: "Boston, MA",
    city: "boston",
    url: "https://www.baa.org/races/boston-marathon",
    participants: [],
    source: "manual",
  },
  {
    id: "race_2",
    name: "NYC Half Marathon",
    date: futureDate(30),
    distance: "Half Marathon",
    location: "New York, NY",
    city: "new_york",
    url: "https://www.nyrr.org/",
    participants: [],
    source: "manual",
  },
  {
    id: "race_3",
    name: "Cherry Blossom 10 Mile",
    date: futureDate(20),
    distance: "10K",
    location: "Washington, DC",
    city: "washington_dc",
    url: "https://www.cherryblossom.org/",
    participants: [],
    source: "manual",
  },
  {
    id: "race_4",
    name: "Peachtree Road Race",
    date: futureDate(60),
    distance: "10K",
    location: "Atlanta, GA",
    city: "atlanta",
    url: "https://www.atlantatrackclub.org/",
    participants: [],
    source: "manual",
  },
  {
    id: "race_5",
    name: "London Marathon",
    date: futureDate(50),
    distance: "Marathon",
    location: "London, UK",
    city: "london",
    url: "https://www.tcslondonmarathon.com/",
    participants: [],
    source: "manual",
  },
  {
    id: "race_6",
    name: "Brooklyn 5K",
    date: futureDate(14),
    distance: "5K",
    location: "Brooklyn, NY",
    city: "new_york",
    url: "https://www.nyrr.org/",
    participants: [],
    source: "manual",
  },
  {
    id: "race_7",
    name: "Charles River 5K",
    date: futureDate(12),
    distance: "5K",
    location: "Cambridge, MA",
    city: "boston",
    url: "",
    participants: [],
    source: "manual",
  },
  {
    id: "race_8",
    name: "ATL Ultra 50K",
    date: futureDate(75),
    distance: "Ultra",
    location: "Stone Mountain, GA",
    city: "atlanta",
    url: "",
    participants: [],
    source: "manual",
  },
];

// ─── Sample Activity Feed ───────────────────────────────────
const FEED_ITEMS = [
  {
    type: "new_member",
    city: "boston",
    message: "🎉 Maria G. just joined the Boston chapter! Welcome, familia!",
    timestamp: pastDate(0),
  },
  {
    type: "run_completed",
    city: "boston",
    message:
      "🏃 Boston chapter completed their Wednesday morning run — 12 runners showed up!",
    timestamp: pastDate(1),
  },
  {
    type: "race_signup",
    city: "boston",
    message: "🏅 Carlos R. signed up for Boston Marathon 2026!",
    timestamp: pastDate(1),
  },
  {
    type: "new_member",
    city: "boston",
    message: "🎉 Ana L. joined the Boston chapter. ¡Bienvenida!",
    timestamp: pastDate(2),
  },
  {
    type: "run_completed",
    city: "boston",
    message: "🏃 Saturday long run along the Esplanade — 8 miles together!",
    timestamp: pastDate(3),
  },
  {
    type: "new_member",
    city: "new_york",
    message: "🎉 Diego M. just joined NYC! Welcome to the crew!",
    timestamp: pastDate(0),
  },
  {
    type: "run_completed",
    city: "new_york",
    message: "🏃 Central Park sunrise run — 18 runners, perfect morning!",
    timestamp: pastDate(1),
  },
  {
    type: "race_signup",
    city: "new_york",
    message: "🏅 Sofia P. is running the NYC Half Marathon!",
    timestamp: pastDate(2),
  },
  {
    type: "new_member",
    city: "new_york",
    message: "🎉 Luis F. joined the NYC chapter. ¡Vamos!",
    timestamp: pastDate(2),
  },
  {
    type: "run_completed",
    city: "new_york",
    message: "🏃 Brooklyn Bridge run complete — what a view!",
    timestamp: pastDate(4),
  },
  {
    type: "new_member",
    city: "washington_dc",
    message: "🎉 Elena R. joined DC! Welcome!",
    timestamp: pastDate(1),
  },
  {
    type: "run_completed",
    city: "washington_dc",
    message: "🏃 National Mall early morning run — 14 runners strong!",
    timestamp: pastDate(2),
  },
  {
    type: "new_member",
    city: "atlanta",
    message: "🎉 Jorge V. joined Atlanta! Welcome, familia!",
    timestamp: pastDate(0),
  },
  {
    type: "new_member",
    city: "london",
    message: "🎉 Isabella C. joined London! Our international squad grows!",
    timestamp: pastDate(1),
  },
  {
    type: "run_completed",
    city: "london",
    message: "🏃 Hyde Park Saturday run — 6 runners in the rain! 💪",
    timestamp: pastDate(3),
  },
];

// ─── Sample Members (for directory) ─────────────────────────
const SAMPLE_MEMBERS = [
  {
    id: "sample_1",
    firstName: "Maria",
    lastName: "Garcia",
    city: "boston",
    runsAttended: 24,
    totalDistanceKm: 180,
  },
  {
    id: "sample_2",
    firstName: "Carlos",
    lastName: "Rodriguez",
    city: "boston",
    runsAttended: 31,
    totalDistanceKm: 260,
  },
  {
    id: "sample_3",
    firstName: "Ana",
    lastName: "Lopez",
    city: "boston",
    runsAttended: 12,
    totalDistanceKm: 85,
  },
  {
    id: "sample_4",
    firstName: "Diego",
    lastName: "Martinez",
    city: "boston",
    runsAttended: 18,
    totalDistanceKm: 140,
  },
  {
    id: "sample_5",
    firstName: "Sofia",
    lastName: "Hernandez",
    city: "boston",
    runsAttended: 28,
    totalDistanceKm: 210,
  },
  {
    id: "sample_6",
    firstName: "Pablo",
    lastName: "Sanchez",
    city: "new_york",
    runsAttended: 35,
    totalDistanceKm: 300,
  },
  {
    id: "sample_7",
    firstName: "Valentina",
    lastName: "Torres",
    city: "new_york",
    runsAttended: 22,
    totalDistanceKm: 175,
  },
  {
    id: "sample_8",
    firstName: "Mateo",
    lastName: "Ramirez",
    city: "new_york",
    runsAttended: 19,
    totalDistanceKm: 150,
  },
  {
    id: "sample_9",
    firstName: "Camila",
    lastName: "Flores",
    city: "new_york",
    runsAttended: 14,
    totalDistanceKm: 100,
  },
  {
    id: "sample_10",
    firstName: "Andres",
    lastName: "Rivera",
    city: "new_york",
    runsAttended: 27,
    totalDistanceKm: 220,
  },
  {
    id: "sample_11",
    firstName: "Elena",
    lastName: "Reyes",
    city: "washington_dc",
    runsAttended: 16,
    totalDistanceKm: 120,
  },
  {
    id: "sample_12",
    firstName: "Jorge",
    lastName: "Vargas",
    city: "atlanta",
    runsAttended: 10,
    totalDistanceKm: 70,
  },
  {
    id: "sample_13",
    firstName: "Isabella",
    lastName: "Cruz",
    city: "london",
    runsAttended: 8,
    totalDistanceKm: 55,
  },
];

// ─── Seed Function ──────────────────────────────────────────
export async function seedAll() {
  console.log("🌱 Seeding Latin Run Club data...");

  // Seed cities
  console.log("  📍 Seeding cities...");
  for (const [id, data] of Object.entries(CITIES)) {
    await setDoc(doc(db, "cities", id), data);
  }

  // Seed runs
  console.log("  🏃 Seeding runs...");
  for (const run of RUNS) {
    const { id, ...data } = run;
    await setDoc(doc(db, "runs", id), data);
  }

  // Seed races
  console.log("  🏅 Seeding races...");
  for (const race of RACES) {
    const { id, ...data } = race;
    await setDoc(doc(db, "races", id), data);
  }

  // Seed activity feed
  console.log("  📡 Seeding activity feed...");
  for (const item of FEED_ITEMS) {
    await addDoc(collection(db, "activity_feed"), item);
  }

  // Seed sample members
  console.log("  👥 Seeding sample members...");
  for (const member of SAMPLE_MEMBERS) {
    const { id, ...data } = member;
    await setDoc(doc(db, "users", id), {
      ...data,
      email: `${data.firstName.toLowerCase()}@example.com`,
      photoURL: "",
      joinedAt: pastDate(Math.floor(Math.random() * 90) + 10),
      stravaConnected: false,
      stravaAthleteId: null,
    });
  }

  console.log("✅ Seed complete! Refresh the dashboard to see data.");
}

export default seedAll;
