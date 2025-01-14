const express=require('express')
const router = express.Router()
const {createPerson,getStaffTasks,updateStaffAvailability,getPatientDetails,getDeliveryPersonwithDeliveries}=require('../controllers/deliverypersoncontroller')

router.post('/deliveryperson', createPerson);
router.get('/deliveryperson/:deliveryPersonId', getDeliveryPersonwithDeliveries);
router.get('/deliveryperson/patients/:mealId', getPatientDetails);




module.exports=router;