const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();
const loginRoutes = require("./routes/loginRoutes");
const patientRoutes = require("./routes/patientRoutes");
const pantryRoutes = require("./routes/pantryRoutes");
const mealRoutes = require("./routes/mealRoutes");
const taskRoutes = require("./routes/taskRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const deliveryPersonRoutes = require("./routes/deliveryPersonRoutes");
const PORT = process.env.PORT || 3000;

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

//cookie Middleware
app.use(cookieParser());

app.use("/api", loginRoutes);
app.use("/api", patientRoutes);
app.use("/api", pantryRoutes);
app.use("/api", mealRoutes);
app.use("/api", taskRoutes);
app.use("/api", deliveryRoutes);
app.use("/api", deliveryPersonRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
