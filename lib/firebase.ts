import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Public application identifiers. Authentication and Firestore rules protect the data.
// Never put service-account credentials or administrative keys in this module.
export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyB60M15NS2kD-gdm2wReNCDRSCDQwaLDks",
  authDomain: "tech-customer-portal.firebaseapp.com",
  projectId: "tech-customer-portal",
  storageBucket: "tech-customer-portal.firebasestorage.app",
  messagingSenderId: "372808352852",
  appId: "1:372808352852:web:1f9b01ac6ebd3d499a99c1",
};

export type FirebaseClient = { auth: Auth; db: Firestore };
let client: FirebaseClient | undefined;

export function getFirebaseClient(): FirebaseClient {
  if (typeof window === "undefined") {
    throw new Error("Customer services can only be initialized in a browser.");
  }
  if (client) return client;
  for (const key of ["apiKey", "authDomain", "projectId", "appId"] as const) {
    const value = firebaseConfig[key];
    if (!value || /YOUR_|REPLACE_|PLACEHOLDER/i.test(value)) {
      throw new Error("Customer account configuration is unavailable.");
    }
  }
  const name = "fourtech-customer";
  const app = getApps().find((candidate) => candidate.name === name) ?? initializeApp(firebaseConfig, name);
  const auth = getAuth(app);
  auth.useDeviceLanguage();
  client = { auth, db: getFirestore(app) };
  return client;
}
