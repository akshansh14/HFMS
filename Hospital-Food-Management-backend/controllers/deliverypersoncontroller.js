const prisma=require('../prisma/server')

    exports.createPerson=async(req, res) =>{
      try {
        const personData = req.body; // name, contactInfo, location, shift, isAvailable
      
        const oldstaff =await prisma.deliveryPerson.findFirst({
          where: {
            email: personData.email,
          },
        })
        if(oldstaff) return res.status(400).json({ message: "Staff member already exists"})
          

      const staff = await prisma.deliveryPerson.create({
        data: personData
      });
      
      return res.status(201).json(staff);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create deliveryPerson member" });
      }
    }
 
    exports.getDeliveryPersonwithDeliveries = async (req, res) => {
        try {
          const { deliveryPersonId } = req.params;
      
          const deliveryPerson = await prisma.deliveryPerson.findUnique({
            where: { id: deliveryPersonId },
            include: {
              activeDeliveries: {
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
      
          if (!deliveryPerson) {
            return res.status(404).json({ message: 'Delivery person not found' });
          }
      
        
          res.status(200).json(deliveryPerson);
        } catch (error) {
          console.error('Error fetching delivery person:', error);
          res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      };
      exports.getAllDeliveryPerson = async (req, res) => {
        try {
          const deliveryPersons = await prisma.deliveryPerson.findMany();
      
          if (!deliveryPersons || deliveryPersons.length === 0) {
            return res
              .status(404)
              .json({ message: "No delivery persons found" });
          }
      
          const sanitizedDeliveryPersons = deliveryPersons.map((person) => {
            const { password, role, ...sanitizedPerson } = person; // Exclude sensitive fields
            return sanitizedPerson;
          });
      
          res.status(200).json(sanitizedDeliveryPersons);
        } catch (error) {
          console.error("Error fetching delivery persons:", error);
          res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
        }
      };

      exports.updateDeliveryStatus = async (req, res) => {
        try {
          const { deliveryId } = req.params;
          const { status, mealId } = req.body;
      
          if (!deliveryId) {
            return res.status(400).json({ message: 'Delivery ID is required' });
          }
          if (!mealId) {
            return res.status(400).json({ message: 'Meal ID is required' });
          }
      
          let updatedDelivery;
      
          if (status === "DELIVERED") {
            updatedDelivery = await prisma.delivery.update({
              where: {
                id: deliveryId,
              },
              data: {
                status,
                endTime: new Date(), // Corrected Date assignment
              },
            });
          } else {
            updatedDelivery = await prisma.delivery.update({
              where: {
                id: deliveryId,
              },
              data: {
                status,
              },
            });
          }
      
          if (!updatedDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
          }
      
          const meal = await prisma.meal.update({
            where: {
              id: mealId,
            },
            data: {
              status,
            },
          });
      
          if (!meal) {
            return res.status(404).json({ message: 'Meal not found' });
          }
      
          res.status(200).json({
            message: 'Delivery status updated successfully',
            updatedDelivery,
          });
        } catch (error) {
          console.error('Error updating delivery status:', error);
          res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      };
      
