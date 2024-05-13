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
  const [confirmDelete, setConfirmDelete] = useState(null); // State for confirming deletion

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
    if (confirmDelete === id) {
      try {
        await axios.delete(`http://localhost:3000/cars/${id}`);
        setCars(cars.filter((car) => car.id !== id));
        setConfirmDelete(null); // Reset confirmation state
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    } else {
      setConfirmDelete(id); // Set confirmation state for deletion
    }
  };

  // Add this function to handle confirming deletion
  const confirmDeleteCar = async () => {
    try {
      await axios.delete(`http://localhost:3000/cars/${confirmDelete}`);
      setCars(cars.filter((car) => car.id !== confirmDelete));
      setConfirmDelete(null); // Reset confirmation state
    } catch (error) {
      console.error('Error confirming deletion:', error);
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

  // Rest of the code remains unchanged

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
                {confirmDelete === car.id ? (
                  <>
                    <button onClick={() => handleDeleteCar(car.id)}>Confirm</button>
                    <button onClick={() => setConfirmDelete(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleDeleteCar(car.id)} className='button danger'>Delete</button>
                )}
                <button onClick={() => handleEditCar(car.id)} className='button secondary'>Edit</button>
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

      {confirmDelete && (
        <div className='modal'>
          <div className='modal-content'>
            <p>Are you sure you want to delete this car?</p>
            <button onClick={confirmDeleteCar}>Confirm</button>
            <button onClick={() => setConfirmDelete(null)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
