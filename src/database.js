const mongoose = require("mongoose");

const mongoDB = "mongodb://127.0.0.1/flight_api";
const Schema = mongoose.Schema;
const schema = new Schema({
  _id: Schema.Types.ObjectId,
  continent: String,
  coordinates: String,
  elevation_ft: String,
  gps_code: String,
  iata_code: String,
  ident: String,
  iso_country: String,
  iso_region: String,
  local_code: String,
  municipality: String,
  name: String,
  type: String,
});
schema.index(
  {
    continent: "text",
    gps_code: "text",
    iata_code: "text",
    ident: "text",
    iso_country: "text",
    iso_region: "text",
    local_code: "text",
    municipality: "text",
    name: "text",
  },
  {
    weights: {
      name: 10,
      iata_code: 5,
      gps_code: 5,
    },
  }
);

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
const airports = mongoose.model("airports", schema);

db.on("error", console.error.bind(console.error, "MongoDB connection error: "));

module.exports = {
  airports,
};
