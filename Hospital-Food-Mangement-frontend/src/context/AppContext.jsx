import { createContext, useState } from "react";
import axios from 'axios';



export const AppContext = createContext();

export default function AppContextProvider({children}){

    const [account, setAccount] = useState();


// API Functions
const api = {
  getPatients: () => axios.get('/api/patients'),
  createMeal: (data) => axios.post('/api/meals', data),
  getPendingMeals: () => axios.get('/api/meals/pending'),
  assignTask: (data) => axios.post('/api/assignments', data),
  getDeliveryDetails: () => axios.get('/api/deliveries/pending'),
  assignDelivery: (data) => axios.post('/api/deliveries/assign', data),
};


    const Value={
      account,
      setAccount,
      api,
    }


    return <AppContext.Provider value={Value}>
        {children}
        </AppContext.Provider>
}