import "dotenv/config";
import express from "express";
import { testConnection } from "./src/models/db.js";
import organizationRoutes from "./src/routes/organizationRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import categoryFormRoutes from "./src/routes/category.js";
import organizationFormRoutes from "./src/routes/organization.js"; // NOVO
import projectFormRoutes from "./src/routes/project.js"; // NOVO

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/organizations", organizationRoutes);
app.use("/organization", organizationRoutes);
app.use("/projects", projectRoutes);
app.use("/project", projectRoutes);
app.use("/categories", categoryRoutes);
app.use("/category", categoryRoutes);

// Rotas de formulários (sem prefixo)
app.use(categoryFormRoutes);
app.use(organizationFormRoutes); // NOVO: /new-organization e /edit-organization/:id
app.use(projectFormRoutes); // NOVO: /new-project e /edit-project/:id

// Rota coringa para 404 — DEPOIS de todas as rotas reais
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Handler de erros global — SEMPRE por último
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  console.error("Stack trace:", err.stack);

  const status = err.status || 500;
  const template = status === 404 ? "errors/404" : "errors/500";

  res.status(status).render(template, {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Servidor funcionando na porta ${port}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});