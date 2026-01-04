require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
global.app = app;

app.use(express.json());

app.set("trust proxy", true);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");
// Strict CORS policy
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request Origin: ", origin);
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const msg = `The CORS policy for ${origin} does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use("/api", require("./api/person"));
app.use("/api", require("./api/invoice"));

// Update the global error handling middleware
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  try {
    // return sendErrorToSlack(err.stack || err.message, "vocalo");
  } catch (error) {
    console.error("Error during reporting to Slack:", error);
  }
  res.status(err.status || 500).json({ success: false, message: err.message });
});

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log("Server started at port : ", port);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Error: Port ${port} is already in use. Please terminate the process using this port or choose a different port.`
    );
    process.exit(1);
  } else {
    throw error;
  }
});


