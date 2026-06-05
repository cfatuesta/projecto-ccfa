const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

/**
 * stravaAuth — exchanges Strava OAuth code for tokens and stores them.
 * Called from the frontend StravaCallback page after Strava redirects back.
 *
 * Set environment variables before deploying:
 *   firebase functions:config:set strava.client_id="YOUR_ID" strava.client_secret="YOUR_SECRET"
 */
exports.stravaAuth = functions.https.onCall(async (data, context) => {
  const { code, uid } = data;

  if (!code || !uid) {
    throw new functions.https.HttpsError("invalid-argument", "code and uid are required");
  }

  const clientId = functions.config().strava?.client_id || process.env.STRAVA_CLIENT_ID;
  const clientSecret = functions.config().strava?.client_secret || process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Strava client credentials not configured. Run: firebase functions:config:set strava.client_id=X strava.client_secret=Y",
    );
  }

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Strava token error:", body);
    throw new functions.https.HttpsError("internal", "Strava token exchange failed");
  }

  const tokenData = await response.json();
  const athlete = tokenData.athlete || {};

  // Fetch athlete stats separately if needed (requires additional API call)
  const statsResponse = await fetch(
    `https://www.strava.com/api/v3/athletes/${athlete.id}/stats`,
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
  ).catch(() => null);

  const stats = statsResponse?.ok ? await statsResponse.json() : null;
  const allRunTotals = stats?.all_run_totals || {};

  await db.collection("users").doc(uid).update({
    stravaConnected: true,
    stravaAthleteId: String(athlete.id || ""),
    stravaAccessToken: tokenData.access_token,
    stravaRefreshToken: tokenData.refresh_token,
    stravaTokenExpiresAt: tokenData.expires_at,
    stravaActivities: allRunTotals.count || 0,
    stravaTotalKm: Math.round((allRunTotals.distance || 0) / 1000),
    stravaAvgPace: allRunTotals.elapsed_time && allRunTotals.distance
      ? formatPace(allRunTotals.elapsed_time, allRunTotals.distance)
      : "—",
  });

  return {
    success: true,
    athlete: {
      id: athlete.id,
      firstName: athlete.firstname,
      lastName: athlete.lastname,
      profilePhoto: athlete.profile_medium,
    },
  };
});

/**
 * stravaRefresh — refreshes an expired Strava access token.
 */
exports.stravaRefresh = functions.https.onCall(async (data, context) => {
  const { uid } = data;
  if (!uid) throw new functions.https.HttpsError("invalid-argument", "uid is required");

  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) throw new functions.https.HttpsError("not-found", "User not found");

  const { stravaRefreshToken } = userDoc.data();
  const clientId = functions.config().strava?.client_id || process.env.STRAVA_CLIENT_ID;
  const clientSecret = functions.config().strava?.client_secret || process.env.STRAVA_CLIENT_SECRET;

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: stravaRefreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) throw new functions.https.HttpsError("internal", "Token refresh failed");

  const tokenData = await response.json();
  await db.collection("users").doc(uid).update({
    stravaAccessToken: tokenData.access_token,
    stravaTokenExpiresAt: tokenData.expires_at,
  });

  return { success: true };
});

function formatPace(elapsedSeconds, distanceMeters) {
  if (!distanceMeters) return "—";
  const paceSecondsPerKm = (elapsedSeconds / distanceMeters) * 1000;
  const mins = Math.floor(paceSecondsPerKm / 60);
  const secs = Math.round(paceSecondsPerKm % 60);
  return `${mins}:${String(secs).padStart(2, "0")} /km`;
}
