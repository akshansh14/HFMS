const prisma=require('../prisma/server')

exports.createDelivery = async (req, res) => {
    const deliveryData = req.body; // mealId notes? startTime?
    const { deliveryPersonId } = req.params; // Ensure this is passed in the route parameters
  
    try {
      // Validate if the delivery person exists
      const deliveryPerson = await prisma.deliveryPerson.findUnique({
        where: { id: deliveryPersonId },
      });
  
      if (!deliveryPerson) {
        return res.status(404).json({ message: "Delivery person not found" });
      }
  
      // Create the delivery
      const delivery = await prisma.delivery.create({
        data: {
          deliveryPersonId: deliveryPersonId,
          ...deliveryData,
          startTime: new Date(), // Set start time to the current date/time
        },
      });
      const meail = await prisma.meal.update({
        where: {
          id: deliveryData.mealId,
        },
        data: {
          status: 'DELIVERING',
        },
      });
     
      // Fetch the updated delivery person data including tasks (optional)
      const updatedDeliveryPerson = await prisma.deliveryPerson.findUnique({
        where: { id: deliveryPersonId },
        include: { activeDeliveries: true }, // Include related tasks, if applicable
      });
      
      return res.status(200).json({
        message: "Delivery created successfully",
        delivery,
        updatedDeliveryPerson,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Update task status
//yet to be done !!

exports.updateDeliveryStatus=async (req, res) =>{
  try {
   const { id } = req.params;
   const { status, endTime, notes } = req.body;
   
   const delivery = await prisma.delivery.update({
     where: { id },
     data: {
       status,
       endTime: status === 'DELIVERED' ? new Date() : endTime,
       notes
     }
   });

   // If task is completed, update meal status accordingly
   if (status === 'DELIVERED') {
     await prisma.meal.update({
       where: { id: task.mealId },
       data: {
         status: delivery.taskType === 'PREPARATION' ? 'READY' : 'DELIVERED'
       }
     });
   }
   
  } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Failed to update task status' });
  }
   return res.json(task);
 }

 exports.getAllDeliveries= async(req,res)=>{
  try {
    const deliveries= await prisma.delivery.findMany({
      include: {
        meal: true,
      }
    });
    if(!deliveries){
      return res.status(404).json({ message: "No deliveries found" });
    }
    return res.status(200).json(deliveries);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
    
  }
 }