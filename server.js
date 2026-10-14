const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { message: null, submittedName: "" });
});

app.post("/submit", (req, res) => {
  const submittedName = (req.body.name || "").trim();

  if (!submittedName) {
    return res.status(400).render("index", {
      message: "Please enter your name.",
      submittedName: ""
    });
  }

  res.render("index", {
    message: `Form submitted successfully. Hello, ${submittedName}!`,
    submittedName
  });
});

app.listen(PORT, () => {
  console.log(`Task 1 server running at http://localhost:${PORT}`);
});
