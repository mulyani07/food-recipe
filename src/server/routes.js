/** @format */

const predictClassification = require("../services/inferenceService");
const { storeData, getData } = require("../services/storeData");
const crypto = require("crypto");

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        if (!image) {
            return h.response({
                status: "fail",
                message: "No image found in the payload.",
            }).code(400);
        }

        if (!model) {
            return h.response({
                status: "fail",
                message: "Model is not loaded.",
            }).code(500);
        }

        const { confidenceScore, label, suggestion } = await predictClassification(model, image);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            ingredient: label,
            recipes: suggestion,
            confidenceScore,
            createdAt,
        };

        await storeData(id, data);

        return h.response({
            status: "success",
            message: confidenceScore > 0 ? "Ingredient successfully identified" : "Please use a clearer image.",
            data,
        }).code(201);
    } catch (error) {
        console.error("Error in postPredictHandler:", error);
        return h.response({
            status: "error",
            message: "An internal server error occurred.",
            details: error.message,
        }).code(500);
    }
}

async function getPredictHandler(request, h) {
    try {
        const { id } = request.params;

        const data = await getData(id);

        if (!data) {
            return h.response({
                status: "fail",
                message: "Prediction not found",
            }).code(404);
        }

        return h.response({
            status: "success",
            data,
        }).code(200);
    } catch (error) {
        console.error("Error in getPredictHandler:", error);
        return h.response({
            status: "error",
            message: "An internal server error occurred.",
        }).code(500);
    }
}

module.exports = { postPredictHandler, getPredictHandler };
            