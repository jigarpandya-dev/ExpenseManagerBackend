const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

require("dotenv").config();

const mongoString = process.env.DATABASE_URL;
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const expenseRoutes = require("./routes/expenseroutes");
const { authRoutes } = require("./routes/authroutes");

app.use("/api", expenseRoutes);
app.use("/api/user", authRoutes);
exports.app = functions.https.onRequest(app);
