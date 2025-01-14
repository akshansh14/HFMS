const prisma=require('../prisma/server')    // Create new alert
    exports.createAlert=async (req, res)=> {
     try {
        const alertData = req.body;
      
        const alert = await prisma.alert.create({
          data: alertData
        });
        
        return res.status(201).json(alert);
      }
     catch (error) {
        return res.status(500).json({ message: 'Error creating alert' });
     }
    }
    // Get unread alerts
    exports.getUnreadAlerts=async(req, res)=> {
     try {
        const alerts = await prisma.alert.findMany({
            where: {
              status: 'UNREAD'
            },
            orderBy: {
              createdAt: 'desc'
            }
          });
          
          return res.json(alerts);
     } catch (error) {
        return res.status(500).json({ message: 'Error fetching unread alerts' });
        
     }
    }
  
    // Mark alert as read
    exports.markAlertAsRead=async (req, res) =>{
     try {
        const { id } = req.params;
      
        const alert = await prisma.alert.update({
          where: { id },
          data: { status: 'READ' }
        });
        
        return res.json(alert);
     } catch (error) {
        return res.status(500).json({ message: 'Error marking alert as read' });
        
     }
    }