// lib\firebase\admin.ts
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/* Firebase Environment Variables */
function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) { throw new Error(`Missing Firebase environment variable: ${name}`); }

    return value;
}

/* Firebase Admin Configuration */
const firebaseAdminConfig = {
    credential: cert({
        projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
        clientEmail: getRequiredEnv("FIREBASE_CLIENT_EMAIL"),
        privateKey: getRequiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
};

/* Firebase Admin App */
const appName = "event-maker-admin";

export const adminApp = getApps().find((app) => app.name === appName) ?? initializeApp(firebaseAdminConfig, appName);

/* Firestore */
export const adminDb = getFirestore(adminApp);