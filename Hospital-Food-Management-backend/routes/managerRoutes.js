const express=require('express')
const router = express.Router()
const {createMeal,getMeals}=require('../controllers/mealcontroller')
const {createPatient,updatePatient,getPatients,deletePatient}=require('../controllers/patientcontrollers')
const {createTask,getAllTask}=require('../controllers/taskcontroller')
const {createStaff,getstaff} = require("../controllers/pantrystaffcontroller");
const {getAllDeliveryPerson}=require('../controllers/deliverypersoncontroller')
const {getAllDeliveries,createDelivery}=require('../controllers/deliveryController')


//get reqs
router.get('/get-patient',getPatients),
router.get('/meals', getMeals);
router.get('/tasks', getAllTask);
router.get("/get-staff", getstaff);
router.post('/get-deliveryperson', getAllDeliveryPerson);
router.get('/get-delivery/', getAllDeliveries);



//create reqs
router.post('/meals/:patientId', createMeal);
router.post('/tasks/:staffId', createTask);
router.post('/delivery/:deliveryPersonId', createDelivery);
router.post("/staff", createStaff);


//patient apis
router.post('/create-patient',createPatient),
router.put('/update-patient/:id',updatePatient),
router.delete('/delete-patient/:id',deletePatient),



module.exports=router;