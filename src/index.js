const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const port = 8000;
const db = require("./database");

app.use(cors());
app.use(mongoSanitize());
app.use(helmet());
app.use(morgan("combined"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ Paths: ["/api/search:search", "/api/faa/:faa"] });
});

app.get("/api/search/:search", (req, res) => {
  db.airports
    .find(
      { $text: { $search: `/^${req.params.search}$/i` } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .exec()
    .then((results) => res.json(results));
});

app.get("/api/faa/:faa", (req, res) => {
  db.airports
    .find({ ident: `${req.params.faa}` })
    .exec()
    .then((results) => res.json(results));
});

app.listen(port, () => {
  console.log(`Flight API listening on port ${port}!`);
});
