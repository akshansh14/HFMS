const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();
const loginRoutes = require("./routes/loginRoutes");
const pantryRoutes = require("./routes/pantryRoutes");
const managerRoutes = require("./routes/managerRoutes");
const deliveryPersonRoutes = require("./routes/deliveryPersonRoutes");
const PORT = process.env.PORT || 3000;

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

//cookie Middleware
app.use(cookieParser());

app.use("/api", loginRoutes);
app.use("/api", pantryRoutes);
app.use("/api", managerRoutes);
app.use("/api", deliveryPersonRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
