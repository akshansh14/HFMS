const express = require("express");
const router = express.Router();
const {getPantryStaffWithTasks,updateTaskStatus} = require("../controllers/pantrystaffcontroller");
const {createPerson,getAllDeliveryPerson}=require('../controllers/deliverypersoncontroller')
const {createDelivery}=require('../controllers/deliveryController')


//update task status
router.put('/staff/task-update/:taskId', updateTaskStatus);

//get all delivery person
router.get('/get-deliveryperson', getAllDeliveryPerson);

//gets staff with id and its tasks and meals details
router.get("/staff/:staffId", getPantryStaffWithTasks);

//create deliveryperson
router.post('/deliveryperson', createPerson);

//asign delivery 
router.post('/delivery/:deliveryPersonId', createDelivery);



module.exports = router;
