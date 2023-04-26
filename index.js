require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Path
const connectDB = require("./DB/Databse");
const authRoute = require("./Routes/authRoutes");
const userRoute = require("./Routes/UserRoutes");

// Middleware Path
const notFound = require("./Middleware/NotFoundMiddleware");
const errorHandler = require("./Middleware/ErrorHandler");

const corsOptions = {
  credentials: true,
  origin: "http://localhost:5173",
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("Authentication!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

// Error Handler Middleware
app.use(errorHandler);
app.use(notFound);

const connect = async () => {
  try {
    connectDB(process.env.DB);
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

connect();
