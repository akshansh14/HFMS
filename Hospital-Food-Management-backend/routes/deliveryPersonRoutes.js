const express=require('express')
const router = express.Router()
const {updateDeliveryStatus,getDeliveryPersonwithDeliveries}=require('../controllers/deliverypersoncontroller')


//get delivery person with id and its delivery 
router.get('/deliveryperson/:deliveryPersonId', getDeliveryPersonwithDeliveries);

//update delivery status 
router.get('/deliveryperson/:deliveryPId', updateDeliveryStatus);




module.exports=router;