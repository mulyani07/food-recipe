/** @format */

const { postPredictHandler, getPredictHandler } = require("../server/handler");

const routes = [
    {
        path: "/predict",
        method: "POST",
        handler: postPredictHandler,
        options: {
            payload: {
                allow: "multipart/form-data",
                multipart: true,
                maxBytes: 1048576 * 5, // Maksimum 5MB
            },
        },
    },
    {
        path: "/predict/{id}",
        method: "GET",
        handler: getPredictHandler,
    },
];

module.exports = routes;