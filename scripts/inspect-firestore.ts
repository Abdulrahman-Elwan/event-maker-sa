import { adminDb } from "../lib/firebase/admin";

async function inspectFirestore() {
    const collections = await adminDb.listCollections();

    console.log("\n=== FIRESTORE COLLECTIONS ===\n");

    for (const collection of collections) {
        console.log(`\n📁 ${collection.id}`);

        const snapshot = await collection.limit(20).get();

        if (snapshot.empty) {
            console.log("   └── (empty)");
            continue;
        }

        for (const doc of snapshot.docs) {
            console.log(`   └── 📄 ${doc.id}`);

            const data = doc.data();

            console.log(
                "       fields:",
                Object.keys(data).sort().join(", ")
            );
        }
    }

    console.log("\n=== DONE ===\n");
}

inspectFirestore().catch((error) => {
    console.error("\n❌ Firestore inspection failed:\n");
    console.error(error);
    process.exit(1);
});