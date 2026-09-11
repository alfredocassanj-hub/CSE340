import "dotenv/config";
import express from "express";
import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";
import { getAllCategories } from "./src/models/categories.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/organizations", async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  res.render("organizations", { title, organizations });
});

app.get("/projects", async (req, res) => {
  const projects = await getAllProjects();
  const title = "Our Service Projects";

  res.render("projects", { title, projects });
});

app.get("/categories", async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Project Categories";

  res.render("categories", { title, categories });
});

app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Servidor funcionando na porta ${port}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});