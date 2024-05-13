import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import UpdateCarModal from './components/UpdateCarModal';
import CreateCarModal from './components/CreateCarModal';

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
      const newCarWithId = { ...newCar, id: cars.length + 1 };
      const response = await axios.post('http://localhost:3000/cars', newCarWithId);
      const createdCar = response.data.car;
      setCars([...cars, createdCar]);
      setNewCar({
        carName: '',
        seat: '',
        category: '',
        price: '',
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };


  const handleEditCar = async (id) => {
    const carToEdit = cars.find((car) => car.id === id);
    if (carToEdit) {
      setEditingCar(id);
      setNewCar({ ...carToEdit });
      setShowUpdateModal(true);
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
      setShowUpdateModal(false);
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
        <UpdateCarModal
          newCar={newCar}
          handleUpdateCar={handleUpdateCar}
          setNewCar={setNewCar}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}

      {/* Create Car Modal */}
      {showCreateModal && (
        <CreateCarModal
          newCar={newCar}
          handleCreateCar={handleCreateCar}
          setNewCar={setNewCar}
          setShowCreateModal={setShowCreateModal}
        />
      )}


    </div>
  );
};

export default App;
