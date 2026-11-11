import { adminDb } from "../lib/firebase/admin";

async function checkThemes() {
    const snapshot = await adminDb.collection("settings_themes").get();

    console.log("Firebase Project:", process.env.FIREBASE_PROJECT_ID);
    console.log("Collection Exists:", !snapshot.empty);
    console.log("Documents:", snapshot.docs.map((doc) => ({
        id: doc.id,
        fields: Object.keys(doc.data()),
        data: doc.data(),
    })));
}

checkThemes().catch(console.error);