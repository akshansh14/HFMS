const express=require('express')
const router = express.Router()
const {updateTaskStatus,createTask}=require('../controllers/taskcontroller')


router.post('/tasks/:staffId', createTask);
router.put('/tasks/:id', updateTaskStatus);



module.exports=router;