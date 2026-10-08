import {
    authenticateUser,
    findUserByEmail,
    getAllUsers,
    registerUser
} from "../models/users.js";

import { getVolunteerProjects } from "../models/projects.js";

const showLoginForm = (req, res) => {
    res.render("login", { title: "Login" });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            req.session.user = user;
            req.flash("success", "Login successful!");

            if (res.locals.NODE_ENV === "development") {
                console.log("User logged in:", user);
            }

            res.redirect("/dashboard");
        } else {
            req.flash("error", "Invalid email or password.");
            res.redirect("/login");
        }
    } catch (error) {
        console.error("Error during login:", error);

        req.flash(
            "error",
            "An error occurred during login. Please try again."
        );

        res.redirect("/login");
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash("success", "Logout successful!");
    res.redirect("/login");
};

const showRegisterForm = (req, res) => {
    res.render("register", { title: "Register" });
};

const processRegisterForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            req.flash("error", "An account with that email already exists.");
            return res.redirect("/register");
        }

        await registerUser(name, email, password);

        req.flash("success", "Registration successful! Please log in.");
        res.redirect("/login");
    } catch (error) {
        console.error("Error during registration:", error);

        req.flash(
            "error",
            "An error occurred during registration."
        );

        res.redirect("/register");
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }

    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash(
                "error",
                "You must be logged in to access that page."
            );

            return res.redirect("/login");
        }

        if (req.session.user.role_id !== role) {
            req.flash(
                "error",
                "You do not have permission to access that page."
            );

            return res.redirect("/dashboard");
        }

        next();
    };
};

const showDashboard = async (req, res, next) => {
    try {
        const user = req.session.user;
        const volunteerProjects = await getVolunteerProjects(user.user_id);

        res.render("dashboard", {
            title: "Dashboard",
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            volunteerProjects
        });
    } catch (error) {
        next(error);
    }
};

const showUsers = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.render("users", {
            title: "Users",
            users
        });
    } catch (error) {
        console.error("Error retrieving users:", error);

        req.flash(
            "error",
            "An error occurred while retrieving users."
        );

        res.redirect("/dashboard");
    }
};

export {
    showLoginForm,
    processLoginForm,
    processLogout,
    showRegisterForm,
    processRegisterForm,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
};
