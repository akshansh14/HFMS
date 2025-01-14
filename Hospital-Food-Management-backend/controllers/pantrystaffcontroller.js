const prisma = require("../prisma/server");

// Create new staff member
exports.createStaff = async (req, res) => {
	try {
		const staffData = req.body; // name, contactInfo, location, shift, isAvailable

		const staff = await prisma.pantryStaff.create({
			data: staffData,
		});

		return res.status(201).json(staff);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Failed to create staff member" });
	}
};

// Get staff with their current tasks
exports.getStaffTasks = async (req, res) => {
	try {
		const { id } = req.params;

		const staff = await prisma.pantryStaff.findUnique({
			where: { id },
			include: {
				tasks: {
					include: {
						meal: {
							include: {
								patient: true,
							},
						},
					},
				},
			},
		});

		return res.status(200).json(staff);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to get staff tasks" });
	}
};

// Update staff availability
exports.updateStaffAvailability = async (req, res) => {
	try {
		const { id } = req.params;
		const { isAvailable } = req.body;

		//To convert string to boolean If passed a string
		if (typeof isAvailable === "string") {
			isAvailable = isAvailable.toLowerCase() === "true";
		}

		const staff = await prisma.pantryStaff.update({
			where: { id },
			data: { isAvailable },
		});

		return res.status(200).json(staff);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Failed to update staff availability" });
	}
};

exports.getPantryStaffWithTasks = async (req, res) => {
	const { staffId } = req.params;

	try {
		const pantryStaff = await prisma.pantryStaff.findUnique({
			where: { id: staffId },
			include: { tasks: true }, // Include tasks
		});

		if (!pantryStaff) {
			return res.status(404).json({ message: "Pantry staff not found" });
		}
		pantryStaff.tasks = pantryStaff.tasks.filter((task) =>
			["PENDING", "IN_PROGRESS", "COMPLETED"].includes(task.status)
		);
		return res.status(200).json(pantryStaff);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Server error", error: error.message });
	}
};

exports.getstaff = async (req, res) => {
	try {
		const staffs = await prisma.pantryStaff.findMany();

		if (staffs.length === 0) {
			return res.status(404).json({ message: "No staff found" });
		}

		return res.status(200).json(staffs);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Failed to get staff",
			error: error.message,
		});
	}
};
