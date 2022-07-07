require("dotenv").config();

const express = require("express");
const helmet = require("helmet");

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "15mb" }));
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
