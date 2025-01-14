const express = require("express");
const router = express.Router();
const {
	createStaff,
	getStaffTasks,
	updateStaffAvailability,
	getPantryStaffWithTasks,
	getstaff,
} = require("../controllers/pantrystaffcontroller");

router.post("/staff", createStaff);
router.get("/get-staff", getstaff);
router.get("/staff/:staffId", getPantryStaffWithTasks);

module.exports = router;
