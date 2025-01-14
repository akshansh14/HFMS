const express=require('express')
const router=express.Router()
const {createPatient,updatePatient,getPatients,deletePatient}=require('../controllers/patientcontrollers')

router.post('/create-patient',createPatient),
router.put('/update-patient/:id',updatePatient),
router.get('/get-patient',getPatients),
router.delete('/delete-patient/:id',deletePatient),


module.exports=router;