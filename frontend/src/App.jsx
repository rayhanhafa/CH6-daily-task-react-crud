import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    carName: '',
    seat: '',
    category: '',
    price: '',
  });
  const [editingCar, setEditingCar] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cars');
        setCars(response.data.cars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, []);

  const handleDeleteCar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cars/${id}`);
      setCars(cars.filter((car) => car.id !== id));
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleCreateCar = async () => {
    try {
      const newCarWithId = { ...newCar, id: cars.length + 1 }; // Automatically assign ID
      const response = await axios.post('http://localhost:3000/cars', newCarWithId);
      const createdCar = response.data.car;
      setCars([...cars, createdCar]);
      setNewCar({
        carName: '',
        seat: '',
        category: '',
        price: '',
      });
      setShowCreateModal(false); // Close create modal after successful creation
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };


  const handleEditCar = async (id) => {
    const carToEdit = cars.find((car) => car.id === id);
    if (carToEdit) {
      setEditingCar(id);
      setNewCar({ ...carToEdit }); // Set all attributes for editing
      setShowUpdateModal(true); // Show update modal when editing
    }
  };

  const handleUpdateCar = async () => {
    try {
      await axios.put(`http://localhost:3000/cars/${editingCar}`, newCar);
      const updatedCars = cars.map((car) => (car.id === editingCar ? { ...newCar } : car));
      setCars(updatedCars);
      setEditingCar(null);
      setNewCar({
        carName: '',
        seat: '',
        category: '',
        price: '',
      });
      setShowUpdateModal(false); // Close update modal after successful update
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  return (
    <div className='container'>
      <h1>Cars List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Seat</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.id}</td>
              <td>{car.carName}</td>
              <td>{car.seat}</td>
              <td>{car.category}</td>
              <td>{car.price}</td>
              <td>
                <button onClick={() => handleEditCar(car.id)}>Edit</button>
                <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Add New Car</h2>
        <button onClick={() => setShowCreateModal(true)}>Create</button>
      </div>

      {/* Update Car Modal */}
      {showUpdateModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Update Car</h2>
            <input
              type="text"
              value={newCar.carName}
              onChange={(e) => setNewCar({ ...newCar, carName: e.target.value })}
            />
            <input
              type="text"
              value={newCar.seat}
              onChange={(e) => setNewCar({ ...newCar, seat: e.target.value })}
            />
            <input
              type="text"
              value={newCar.category}
              onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}
            />
            <input
              type="text"
              value={newCar.price}
              onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
            />
            <button onClick={handleUpdateCar}>Update</button>
            <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Create Car Modal */}
      {showCreateModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Add New Car</h2>
            <input
              type="text"
              placeholder="Name"
              value={newCar.carName}
              onChange={(e) => setNewCar({ ...newCar, carName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Seat"
              value={newCar.seat}
              onChange={(e) => setNewCar({ ...newCar, seat: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={newCar.category}
              onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price"
              value={newCar.price}
              onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
            />
            <button onClick={handleCreateCar}>Create</button>
            <button onClick={() => setShowCreateModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
