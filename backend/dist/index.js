"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const routes_1 = require("./import/routes");
const errors_1 = require("./middleware/errors");
const missing_1 = require("./middleware/missing");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check route
app.get("/", (_req, res) => {
    res.json({ message: "Backend is running", status: "OK" });
});
// TODO: Add your routes here
// import authRoutes from "./routes/auth.routes";
// app.use("/api/auth", authRoutes);
app.get("/api/v1/health", (_req, res) => {
    res.json({ success: true, message: "Backend is running" });
});
app.use("/api/v1/imports", routes_1.router);
app.use(missing_1.missing);
app.use(errors_1.errors);
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on http://localhost:${env_1.env.PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map