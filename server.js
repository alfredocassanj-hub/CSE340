import "dotenv/config";
import express from "express";
import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";

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

app.get("/projects", (req, res) => {
  res.render("projects", { title: "Projects" });
});

app.get("/categories", (req, res) => {
  res.render("categories", { title: "Categories" });
});

app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Servidor funcionando na porta ${port}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});