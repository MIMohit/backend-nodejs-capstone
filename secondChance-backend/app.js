require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const logger = require("./logger");

const connectToDatabase = require("./models/db");
const secondChanceItemsRoutes = require("./routes/secondChanceItemsRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

const port = process.env.PORT || 3060;

// Connect to MongoDB one time at startup
connectToDatabase()
  .then(() => logger.info("Connected to DB"))
  .catch((e) => console.error("Failed to connect to DB", e));

// Routes
app.use("/api/secondchance", secondChanceItemsRoutes);

app.get("/", (req, res) => {
  res.send("Inside the server");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use("/api/secondchance/search", searchRoutes);
