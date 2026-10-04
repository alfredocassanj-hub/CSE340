import "dotenv/config";
import express from "express";
import session from "express-session";
import { testConnection } from "./src/models/db.js";

import userRoutes from "./src/routes.js";
import organizationRoutes from "./src/routes/organizationRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import categoryFormRoutes from "./src/routes/category.js";
import organizationFormRoutes from "./src/routes/organization.js";
import projectFormRoutes from "./src/routes/project.js";

const app = express();
const port = process.env.PORT || 3000;

// EJS
app.set("views", "./views");
app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

// Form data
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || "dev-secret-change-me",
        resave: false,
        saveUninitialized: false,
    })
);

// Flash messages
app.use((req, res, next) => {
    req.flash = (type, message) => {
        req.session.flash = {
            type,
            message
        };
    };

    res.locals.flash = req.session.flash || null;
    delete req.session.flash;

    next();
});

// Login state
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    res.locals.isAdmin = false;

    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;

        if (req.session.user.role_id === 2) {
            res.locals.isAdmin = true;
        }
    }

    res.locals.NODE_ENV = process.env.NODE_ENV;

    next();
});

// Home
app.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    });
});

// Main routes
app.use("/organizations", organizationRoutes);
app.use("/organization", organizationRoutes);

app.use("/projects", projectRoutes);
app.use("/project", projectRoutes);

app.use("/categories", categoryRoutes);
app.use("/category", categoryRoutes);

// Form routes
app.use(categoryFormRoutes);
app.use(organizationFormRoutes);
app.use(projectFormRoutes);

// User routes
app.use(userRoutes);

// Catch-all 404 route
app.use((req, res, next) => {
    console.log("404 URL:", req.method, req.originalUrl);

    const err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error occurred:", err.message);
    console.error("Stack trace:", err.stack);

    const status = err.status || 500;

    const template = status === 404
        ? "errors/404"
        : "errors/500";

    res.status(status).render(template, {
        title: status === 404
            ? "Page Not Found"
            : "Server Error",

        error: err.message,

        stack: process.env.NODE_ENV === "development"
            ? err.stack
            : null,
    });
});

// Start server
app.listen(port, async () => {
    try {
        await testConnection();

        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.error(
            "Error connecting to the database:",
            error
        );
    }
});