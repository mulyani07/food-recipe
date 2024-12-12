const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
    const modelPath = process.env.APP_ENV === "local" ? process.env.LOCAL_MODEL_URL  : process.env.PRODUCTION_MODEL_URL;

    if (!modelPath) {
        throw new Error("Model URL is not defined in environment variables.");
    }

    try {
        console.log(`Loading model from: ${modelPath}`);
        return await tf.loadGraphModel(modelPath);
    } catch (error) {
        console.error("Error loading model:", error);
        throw new Error("Failed to load the TensorFlow model.");
    }
}

module.exports = loadModel;