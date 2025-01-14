import React, { useContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { AppContext } from "../context/AppContext";


// Patients Component
const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [mealData, setMealData] = useState({ patientId: '', mealType: '', ingredients: '', instructions: '' });
        const { api } = useContext(AppContext);
    
  
    const fetchPatients = async () => {
      const { data } = await api.getPatients();
      setPatients(data);
    };
  
    const handleCreateMeal = async () => {
      await api.createMeal(mealData);
      setOpenDialog(false);
      setMealData({ patientId: '', mealType: '', ingredients: '', instructions: '' });
    };
  
    return (
      <div className="patients-tab">
        <Button onClick={fetchPatients}>Load Patients</Button>
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              {patient.name} - {patient.room}
              <Button onClick={() => { setMealData({ ...mealData, patientId: patient.id }); setOpenDialog(true); }}>Create Meal</Button>
            </li>
          ))}
        </ul>
  
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Create Meal</DialogTitle>
          <DialogContent>
            <Select
              value={mealData.mealType}
              onChange={(e) => setMealData({ ...mealData, mealType: e.target.value })}
            >
              <MenuItem value="Breakfast">Breakfast</MenuItem>
              <MenuItem value="Lunch">Lunch</MenuItem>
              <MenuItem value="Dinner">Dinner</MenuItem>
            </Select>
            <TextField
              label="Ingredients"
              value={mealData.ingredients}
              onChange={(e) => setMealData({ ...mealData, ingredients: e.target.value })}
              fullWidth
            />
            <TextField
              label="Instructions"
              value={mealData.instructions}
              onChange={(e) => setMealData({ ...mealData, instructions: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateMeal}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  export default Patients;