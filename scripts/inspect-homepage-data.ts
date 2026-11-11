import { adminDb } from "../lib/firebase/admin";

async function inspectHomepageData() {
    console.log("\n=== HOMEPAGE SETTINGS ===\n");

    const settingsDoc = await adminDb
        .collection("site_settings")
        .doc("settings_homepage")
        .get();

    if (settingsDoc.exists) {
        console.dir(settingsDoc.data(), { depth: null });
    } else {
        console.log("Homepage settings document not found.");
    }

    console.log("\n=== FIRST EXHIBITION ===\n");

    const exhibitionsSnapshot = await adminDb
        .collection("exhibitions")
        .limit(1)
        .get();

    if (exhibitionsSnapshot.empty) {
        console.log("No exhibitions found.");
    } else {
        const exhibition = exhibitionsSnapshot.docs[0];

        console.log("Document ID:", exhibition.id);
        console.dir(exhibition.data(), { depth: null });

        console.log("\n=== FIELD TYPES ===\n");

        const data = exhibition.data();

        for (const [key, value] of Object.entries(data)) {
            console.log(
                `${key}:`,
                value === null
                    ? "null"
                    : Array.isArray(value)
                        ? "array"
                        : value?.constructor?.name ?? typeof value
            );
        }
    }

    console.log("\n=== DONE ===\n");
}

inspectHomepageData().catch((error) => {
    console.error("\n❌ Inspection failed:\n");
    console.error(error);
    process.exit(1);
});