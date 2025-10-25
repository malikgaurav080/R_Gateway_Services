const express = require("express");
const dotenv = require("dotenv");

const expressProxy = require("express-http-proxy");
const app = express();
dotenv.config();

app.use("/user", expressProxy(process.env.User_SERVICE_URL));
app.use("/captain", expressProxy(process.env.Captain_SERVICE_URL));
app.use("/ride", expressProxy(process.env.Ride_SERVICE_URL));

app.listen(process.env.PORT, () => {
  console.log("Gateway running on port 3000");
});
