const prisma=require('../prisma/server')

    // Create new staff member
    exports.createPerson=async(req, res) =>{
      try {
        const personData = req.body; // name, contactInfo, location, shift, isAvailable
      
      const staff = await prisma.deliveryPerson.create({
        data: personData
      });
      
      return res.status(201).json(staff);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create deliveryPerson member" });
      }
    }
  
    // Get staff with their current tasks
    exports.getStaffTasks=async(req, res)=> {
    try {
        const { id } = req.params;
      
        const staff = await prisma.pantryStaff.findUnique({
          where: { id },
          include: {
            tasks: {
              include: {
                meal: {
                  include: {
                    patient: true
                  }
                }
              }
            }
          }
        });
        
        return res.status(200).json(staff);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get staff tasks" });
    }
    }
  
    // Update staff availability
    exports.updateStaffAvailability=async(req, res)=> {
     try {
        const { id } = req.params;
        const { isAvailable } = req.body;
    
        //To convert string to boolean If passed a string 
    if (typeof isAvailable === 'string') {
        isAvailable = isAvailable.toLowerCase() === 'true'; 
      }
        
        const staff = await prisma.pantryStaff.update({
          where: { id },
          data: { isAvailable }
        });
        
        return res.status(200).json(staff);
     } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update staff availability" });
     }
    }
  
    exports.getDeliveryPersonwithDeliveries = async (req, res) => {
        try {
          const { deliveryPersonId } = req.params;
      
          const deliveryPerson = await prisma.deliveryPerson.findUnique({
            where: { id: deliveryPersonId },
            include: {
              activeDeliveries: true,
            },
          });
      
          if (!deliveryPerson) {
            return res.status(404).json({ message: 'Delivery person not found' });
          }
      
        
          res.status(200).json(deliveryPerson);
        } catch (error) {
          console.error('Error fetching delivery person:', error);
          res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      };
      
      exports.getPatientDetails=async(req,res)=>{
        try {
          const { mealId } = req.params;
          const meal = await prisma.meal.findUnique({where: { id: mealId },});
          const mealtime=meal.mealTime
          const patient = await prisma.patient.findUnique({
            where: { id: meal.patientId },
          })
          if (!meal || !patient) {
            return res.status(404).json({ message: 'Meal or patient not found' });
            }
            
            res.status(200).json(patient )
        } catch (error) {
          console.error('Error fetching patient details:', error);
          res.status(500).json({ message: 'Internal server error', error: error.message });
          
        }
      }
