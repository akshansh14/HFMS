import React, { useContext, useState } from "react";
import {  Button, Select, MenuItem } from '@mui/material';
import { AppContext } from "../context/AppContext";


// Delivery Assignment Component
const DeliveryAssignment = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
      const { api } = useContext(AppContext);
  

  const fetchDeliveryDetails = async () => {
    const { data } = await api.getDeliveryDetails();
    setDeliveries(data);
  };

  const handleAssignDelivery = async () => {
    await api.assignDelivery({ deliveryPersonId: selectedDeliveryPerson, deliveries: deliveries.map((delivery) => delivery.id) });
    setDeliveries([]);
  };

  return (
    <div className="delivery-tab">
      <Button onClick={fetchDeliveryDetails}>Load Deliveries</Button>
      <Select
        value={selectedDeliveryPerson}
        onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
      >
        <MenuItem value="delivery1">Delivery Person 1</MenuItem>
        <MenuItem value="delivery2">Delivery Person 2</MenuItem>
      </Select>
      <Button onClick={handleAssignDelivery}>Assign Deliveries</Button>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>{delivery.details}</li>
        ))}
      </ul>
    </div>
  );
};

  export default DeliveryAssignment;