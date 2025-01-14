const express=require('express')
const router = express.Router()
const {createStaff,getStaffTasks,updateStaffAvailability,getPantryStaffWithTasks}=require('../controllers/pantrystaffcontroller')

router.post('/staff', createStaff);
router.get('/staff/:staffId', getPantryStaffWithTasks);


module.exports=router;