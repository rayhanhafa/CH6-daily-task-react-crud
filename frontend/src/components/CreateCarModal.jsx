import React from 'react';

const CreateCarModal = ({ newCar, handleCreateCar, setNewCar, setShowCreateModal }) => (
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
);

export default CreateCarModal;
