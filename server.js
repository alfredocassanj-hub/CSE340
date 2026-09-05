import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/organizations", (req, res) => {
  res.render("organizations", { title: "Organizations" });
});

app.get("/projects", (req, res) => {
  res.render("projects", { title: "Projects" });
});

app.get("/categories", (req, res) => {
  res.render("categories", { title: "Categories" });
});

app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}`);
});