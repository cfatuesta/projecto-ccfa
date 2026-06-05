import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
  deleteField,
  increment,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

// ─── User Profiles ───────────────────────────────────────────

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createUserProfile(uid, data) {
  await setDoc(
    doc(db, "users", uid),
    {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      city: data.city || "new_york",
      photoURL: data.photoURL || "",
      runningLevel: data.runningLevel || 50,
      joinedAt: serverTimestamp(),
      stravaConnected: false,
      stravaAthleteId: null,
      runsAttended: 0,
      totalDistanceKm: 0,
      totalPoints: 0,
      isAdmin: false,
    },
    { merge: true },
  );
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}

export async function disconnectStrava(uid) {
  await updateDoc(doc(db, "users", uid), {
    stravaConnected: false,
    stravaAthleteId: null,
    stravaAccessToken: null,
    stravaRefreshToken: null,
    stravaTokenExpiresAt: null,
    stravaActivities: 0,
    stravaTotalKm: 0,
    stravaAvgPace: "—",
  });
}

export async function isUserAdmin(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().isAdmin === true : false;
}

// ─── Cities ──────────────────────────────────────────────────

export async function getAllCities() {
  const snap = await getDocs(collection(db, "cities"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getCityInfo(cityId) {
  const snap = await getDoc(doc(db, "cities", cityId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ─── City Members ────────────────────────────────────────────

export async function getCityMembers(cityId) {
  const q = query(collection(db, "users"), where("city", "==", cityId));
  const snap = await getDocs(q);
  const members = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return members.sort((a, b) => (b.joinedAt?.toMillis?.() || 0) - (a.joinedAt?.toMillis?.() || 0));
}

// ─── Runs ────────────────────────────────────────────────────

export function subscribeToCityRuns(cityId, callback) {
  const q = query(collection(db, "runs"), where("city", "==", cityId));
  return onSnapshot(q, (snap) => {
    let runs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    runs = runs.filter((r) => r.status === "upcoming");
    runs.sort((a, b) => (a.date?.toMillis?.() || 0) - (b.date?.toMillis?.() || 0));
    callback(runs);
  });
}

export async function getNextRun(cityId) {
  const q = query(collection(db, "runs"), where("city", "==", cityId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  let runs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const nowMs = Date.now();
  runs = runs.filter(
    (r) => r.status === "upcoming" && (r.date?.toMillis?.() || 0) >= nowMs
  );
  if (runs.length === 0) return null;
  runs.sort((a, b) => (a.date?.toMillis?.() || 0) - (b.date?.toMillis?.() || 0));
  return runs[0];
}

export async function toggleRunRSVP(runId, uid) {
  const ref = doc(db, "runs", runId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const rsvps = snap.data().rsvps || [];
  if (rsvps.includes(uid)) {
    await updateDoc(ref, { rsvps: arrayRemove(uid) });
    return false;
  } else {
    await updateDoc(ref, { rsvps: arrayUnion(uid) });
    return true;
  }
}

export async function getPastUserRuns(uid) {
  const runsRef = collection(db, "runs");
  const q = query(
    runsRef,
    where("status", "==", "completed"),
    where("attendees", "array-contains", uid),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Races ───────────────────────────────────────────────────

export async function getRaces(filters = {}) {
  let q = collection(db, "races");
  const constraints = [];

  if (filters.city) {
    constraints.unshift(where("city", "==", filters.city));
  }
  if (filters.distance) {
    constraints.unshift(where("distance", "==", filters.distance));
  }

  q = query(q, ...constraints);
  const snap = await getDocs(q);
  let races = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  races.sort((a, b) => (a.date?.toMillis?.() || 0) - (b.date?.toMillis?.() || 0));
  return races;
}

export async function getRace(raceId) {
  const snap = await getDoc(doc(db, "races", raceId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getRaceWithParticipantDetails(raceId) {
  const raceSnap = await getDoc(doc(db, "races", raceId));
  if (!raceSnap.exists()) return null;
  const raceData = { id: raceSnap.id, ...raceSnap.data() };

  const participants = raceData.participants || [];
  const participantCities = raceData.participantCities || {};

  const profiles = await Promise.all(
    participants.map(async (uid) => {
      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists())
        return { uid, firstName: "Unknown", lastName: "", homeCity: "unknown" };
      return {
        uid,
        ...snap.data(),
        homeCity: participantCities[uid] || snap.data().city,
      };
    }),
  );

  return { ...raceData, participantDetails: profiles };
}

export async function getUserNextRace(uid) {
  const q = query(collection(db, "races"), where("participants", "array-contains", uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  let races = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const nowMs = Date.now();
  races = races.filter((r) => (r.date?.toMillis?.() || 0) >= nowMs);
  if (races.length === 0) return null;
  races.sort((a, b) => (a.date?.toMillis?.() || 0) - (b.date?.toMillis?.() || 0));
  return races[0];
}

export async function getAttendedRaces(uid) {
  const q = query(collection(db, "races"), where("confirmedAttendees", "array-contains", uid));
  const snap = await getDocs(q);
  let races = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  races.sort((a, b) => (b.date?.toMillis?.() || 0) - (a.date?.toMillis?.() || 0));
  return races;
}

export async function toggleRaceParticipation(raceId, uid, homeCity) {
  const ref = doc(db, "races", raceId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const participants = snap.data().participants || [];
  if (participants.includes(uid)) {
    const update = {
      participants: arrayRemove(uid),
      [`participantCities.${uid}`]: deleteField(),
    };
    await updateDoc(ref, update);
    return false;
  } else {
    const update = { participants: arrayUnion(uid) };
    if (homeCity) update[`participantCities.${uid}`] = homeCity;
    await updateDoc(ref, update);
    return true;
  }
}

export async function confirmRaceAttendance(raceId, uid) {
  const raceRef = doc(db, "races", raceId);
  const raceSnap = await getDoc(raceRef);
  if (!raceSnap.exists()) return;

  const raceData = raceSnap.data();
  if ((raceData.confirmedAttendees || []).includes(uid)) return;

  const pointValue = raceData.pointValue || 0;
  await updateDoc(raceRef, { confirmedAttendees: arrayUnion(uid) });
  if (pointValue > 0) {
    await updateDoc(doc(db, "users", uid), {
      totalPoints: increment(pointValue),
    });
  }
}

export async function updateRacePointValue(raceId, pointValue) {
  await updateDoc(doc(db, "races", raceId), { pointValue });
}

export async function createRace(data) {
  const ref = await addDoc(collection(db, "races"), {
    ...data,
    participants: [],
    participantCities: {},
    confirmedAttendees: [],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRace(raceId, data) {
  await updateDoc(doc(db, "races", raceId), data);
}

export async function deleteRace(raceId) {
  await deleteDoc(doc(db, "races", raceId));
}

export function subscribeToRaceConfirmedAttendees(raceId, callback) {
  return onSnapshot(doc(db, "races", raceId), async (snap) => {
    if (!snap.exists()) {
      callback([]);
      return;
    }
    const confirmedUids = snap.data().confirmedAttendees || [];
    const profiles = await Promise.all(
      confirmedUids.map(async (uid) => {
        const userSnap = await getDoc(doc(db, "users", uid));
        return userSnap.exists()
          ? { id: uid, ...userSnap.data() }
          : { id: uid, firstName: "Unknown", lastName: "" };
      }),
    );
    callback(profiles);
  });
}

// ─── Leaderboard ─────────────────────────────────────────────

export async function getLeaderboard(cityId = null, limitCount = 10) {
  let q;
  if (cityId) {
    q = query(collection(db, "users"), where("city", "==", cityId));
  } else {
    q = query(collection(db, "users"));
  }
  const snap = await getDocs(q);
  let users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  users.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  return users.slice(0, limitCount);
}

// ─── Activity Feed ───────────────────────────────────────────

export function subscribeToActivityFeed(cityId, callback) {
  const q = query(collection(db, "activity_feed"), where("city", "==", cityId));
  return onSnapshot(q, (snap) => {
    let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    items.sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
    callback(items.slice(0, 10));
  });
}

// ─── Admin User Management ───────────────────────────────────

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateUserAdminStatus(uid, isAdmin) {
  await updateDoc(doc(db, "users", uid), { isAdmin });
}
