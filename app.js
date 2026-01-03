const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressjwt = require("./helpers/helper");
const { errorHandling } = require("./helpers/errorHandling");

const userRouter = require("./routes/users");
const productRouter = require("./routes/products");
const orderRouter = require("./routes/orders");
const categoryRouter = require("./routes/categories");
const path = require("path");

dotenv.config({ path: ".env" });
const app = express();

const API = process.env.API;

// connect to database
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());
app.options(/.*/, cors());
app.use(expressjwt.authJwt());

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(`${API}/users`, userRouter);
app.use(`${API}/products`, productRouter);
app.use(`${API}/orders`, orderRouter);
app.use(`${API}/categories`, categoryRouter);

app.get(`${API}/`, (req, res) => {
  res.send("welcome to e-commerece");
});

//global error handling
app.use(errorHandling);

const port = process.env.PORT || 3000;
app.listen(port, "127.0.0.1", () => {
  console.log(`server is running on port: ${port}`);
});
