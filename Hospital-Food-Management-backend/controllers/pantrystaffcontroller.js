const prisma = require("../prisma/server");

// Create new staff member
exports.createStaff = async (req, res) => {
  try {
    const staffData = req.body; // name, contactInfo, location, shift, 
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
		where: { id: staffId }, 
		include: {
		  tasks: {
			include: {
			  meal: true, 
			},
		  },
		},
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

exports.updateTaskStatus=async(req,res)=>{
	try {
	  const {taskId}= req.params;
	  const {status,mealId}=req.body;
	  const updatedTask={}
	  if(status=== "COMPLETED"){
		updatedTask =await prisma.task.update({
			where:{
			  id:taskId,
			},
			data:{
			  status,
			  completedTime: new Date.now(),
			}
		})
	  }else{
		updatedTask =await prisma.task.update({
			where:{
			  id:taskId,
			},
			data:{
			  status,
			}
		})
	  }
	  if(!updatedTask){
		return res.status(404).json({message:'Delivery not found'});
		}
	  const meal =await prisma.meal.update({
		  where:{
			id:mealId,
		  },
		  data:{
			status,
		  }
	  })
	  if(!meal){
		return res.status(404).json({message:'Meal not found'});
		}
		res.status(200).json({
			message: "Task status updated successfully",
		});
	} catch (error) {
	  console.error('Error updating delivery status:', error);
	  res.status(500).json({ message: 'Internal server error', error: error.message });
	}
  }
