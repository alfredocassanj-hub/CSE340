import express from "express";

import {
    showLoginForm,
    processLoginForm,
    processLogout,
    showRegisterForm,
    processRegisterForm,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
} from "./controllers/users.js";

const router = express.Router();

// User login routes
router.get("/login", showLoginForm);

router.post("/login", processLoginForm);

router.get("/logout", processLogout);

// User registration routes
router.get("/register", showRegisterForm);

router.post("/register", processRegisterForm);

// Protected dashboard route
router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);

// Admin users page
router.get(
    "/users",
    requireLogin,
    requireRole(2),
    showUsers
);

export default router;