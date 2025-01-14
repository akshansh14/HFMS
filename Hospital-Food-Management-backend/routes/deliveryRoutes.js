const express=require('express')
const router = express.Router()
const {getDeliveriesbyId,createDelivery}=require('../controllers/deliveryController')


router.post('/delivery/:deliveryPersonId', createDelivery);
router.get('/delivery/:deliveryPersonId', getDeliveriesbyId);



module.exports=router;