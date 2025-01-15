const prisma = require("../prisma/server");

// Create new staff member
exports.createStaff = async (req, res) => {
  try {
    const staffData = req.body; // name, contactInfo, location,  
    const oldstaff =await prisma.pantryStaff.findFirst({
		where: {
			email: staffData.email,
		},
	})
	if(oldstaff) return res.status(400).json({ message: "Staff member already exists"})

    const staff = await prisma.pantryStaff.create({
      data: staffData,
    });

    return res.status(201).json(staff);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create staff member" });
  }
};

exports.getPantryStaffWithTasks = async (req, res) => {
  const { staffId } = req.params;

  try {
	const pantryStaff = await prisma.pantryStaff.findUnique({
		where: {
		  id: staffId,
		},
		include: {
		  tasks: {
			include: {
			  meal: {
				include: {
				  patient: true, // Ensure 'patient' is a valid relation in the schema
				},
			  },
			},
		  },
		},
	  })

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

		const staff = staffs.map((staff) => {
			return { ...staff, password: undefined, role: undefined };
		});

		return res.status(200).json(staff);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Failed to get staff",
			error: error.message,
		});
	}
};

exports.updateTaskStatus = async (req, res) => {
	try {
	  const { taskId } = req.params;
	  const { status, mealId, updatedAt } = req.body;
  
	  // Initialize variables to store the results
	  let updatedTask;
	  let updatedMeal;
  
	  if (status === "COMPLETED") {
		// Update the task with the new status and completion time
		updatedTask = await prisma.task.update({
		  where: {
			id: taskId,
		  },
		  data: {
			status,
			completedTime: new Date(updatedAt), // Ensure `updatedAt` is a valid date string
		  },
		});
  
		// Update the meal status to READY
		updatedMeal = await prisma.meal.update({
		  where: {
			id: mealId,
		  },
		  data: {
			status: "READY",
		  },
		});
	  } else {
		// Update the task with the new status only
		updatedTask = await prisma.task.update({
		  where: {
			id: taskId,
		  },
		  data: {
			status,
		  },
		});
	  }
  
	  // Check if the updates were successful
	  if (!updatedTask) {
		return res.status(404).json({ message: "Task not found" });
	  }
  
	  if (status === "COMPLETED" && !updatedMeal) {
		return res.status(404).json({ message: "Meal not found" });
	  }
  
	  // Respond with success message
	  res.status(200).json({
		message: "Task status updated successfully",
	  });
	} catch (error) {
	  console.error("Error updating task status:", error);
	  res.status(500).json({ message: "Internal server error", error: error.message });
	}
  };
  