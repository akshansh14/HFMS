 const prisma=require('../prisma/server')

 exports.createTask = async (req, res) => {
    const taskData = req.body; // mealId notes
    const { staffId }=req.params;
    try {
      const task = await prisma.task.create({
        data: {
            staffId:staffId,
            ...taskData
        },
      });
      const meal=await prisma.meal.update({
        where: { id: taskData.mealId },
        data: {
            status: 'PREPARING'
          }
      })
      const pantryStaff = await prisma.pantryStaff.findUnique({
        where: { id: staffId },
        include: { tasks: true }, // Include the tasks relation
      });
      return res.status(201).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };



 // Update task status

 exports.updateTaskStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
  
      // Check if the task exists
      const task = await prisma.task.findUnique({ where: { id: id } });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Update the task
      const updatedTask = await prisma.task.update({
        where: { id: id },
        data: {
          status,
          completedTime: status === "COMPLETED" ? new Date() : null,
          notes,
        },
      });
  
      // If the task is completed, update the related meal status
      if (status === "COMPLETED") {
        await prisma.meal.update({
          where: { id: task.mealId },
          data: { status: "READY" },
        });
      }
  
      return res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update task status", error: error.message });
    }
  };
  
 