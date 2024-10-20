import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

// middleware
const app = express();
app.use(morgan("tiny")); // Log HTTP requests

// Enable CORS for specified origin and methods
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    credentials: true, // Allow credentials if needed
  })
);

// Increase the payload limit for JSON and URL-encoded data
app.use(express.json({ limit: "10mb" })); // Adjust this limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Parse URL-encoded data

app.disable("x-powered-by"); // Hide server information

const port = 8080;

/** HTTP GET Request */
app.get("/", (req, res) => {
  res.status(200).json("Hello from server"); // Use 200 for successful requests
});

/** API Routes */
app.use("/api", router); // http://localhost:8080/api/

/** Start server only when we have a valid connection */
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Invalid database connection!", error);
  });
