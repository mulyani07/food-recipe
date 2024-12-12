const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
    try {
        if (!image) throw new InputError("Image is required.");

        const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();
        const prediction = model.predict(tensor);
        const score = await prediction.data();

        if (!score || score.length === 0) {
            throw new Error("Model returned no predictions.");
        }

        const confidenceScore = Math.max(...score) * 100;
        const labelIndex = score.indexOf(Math.max(...score));
        const labels = ["Cabbage", "Cauliflower", "Bottle-Gourd"];
        const label = labels[labelIndex] || "Unknown";

        const recipeSuggestions = {
            Cabbage: [
                { recipeName: "Cabbage Stir Fry", ingredients: ["Cabbage", "Garlic"], instructions: "Stir fry ingredients." },
            ],
            Cauliflower: [
                { recipeName: "Cauliflower Rice", ingredients: ["Cauliflower", "Garlic"], instructions: "Cook the ingredients." },
            ],
        };

        return {
            confidenceScore,
            label,
            suggestion: recipeSuggestions[label] || [],
        };
    } catch (error) {
        console.error("Error in predictClassification:", error);
        throw new InputError("Prediction failed. Ensure the image format is correct.");
    }
}

module.exports = predictClassification;