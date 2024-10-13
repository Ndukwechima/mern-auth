import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

// middleware
const app = express();
app.use(morgan("tiny"));
app.use(express.json()); // to parse json data
app.use(cors());
app.disable("x-powered-by"); // to hide the server information

const port = 8080;

/** HTTP GET Request*/
app.get("/", (req, res) => {
  res.status(201).json("Hello from server"); // 201 means created
});

/** API Routes*/
app.use("/api", router); // http://localhost:8080/api/

/** start server only when we have valid connection*/
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server is running to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection!");
  });
