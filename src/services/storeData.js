const { Firestore } = require("@google-cloud/firestore");

async function database() {
    const settings = {
        projectId: process.env.PROJECT_ID,
    };

    try {
        const db = new Firestore(process.env.APP_ENV === "local" ? settings : undefined);
        console.log("Connected to Firestore.");
        return db;
    } catch (error) {
        console.error("Error connecting to Firestore:", error);
        throw new Error("Firestore connection failed.");
    }
}

async function storeData(id, data) {
    const ingredientCollection = (await database()).collection("ingredientScans");
    return ingredientCollection.doc(id).set(data);
}

async function getData(id = null) {
    const ingredientCollection = (await database()).collection("ingredientScans");
    if (id) {
        const doc = await ingredientCollection.doc(id).get();
        if (!doc.exists) return null;
        return doc.data();
    } else {
        const snapshot = await ingredientCollection.get();
        return snapshot.docs.map(doc => doc.data());
    }
}

module.exports = { storeData, getData };