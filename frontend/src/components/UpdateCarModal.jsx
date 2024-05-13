import React from 'react';

const UpdateCarModal = ({ newCar, handleUpdateCar, setNewCar, setShowUpdateModal }) => (
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
);

export default UpdateCarModal;
