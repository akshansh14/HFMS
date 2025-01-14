const express=require('express')
const router = express.Router()
const {createMeal,updateMeal,getMeals}=require('../controllers/mealcontroller')

router.post('/meals/:patientId', createMeal);
router.put('/meals/:patientId/status', updateMeal);
router.get('/meals', getMeals);


module.exports=router;