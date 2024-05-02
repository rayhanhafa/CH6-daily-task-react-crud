import fs from 'fs/promises';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // add PUT and DELETE
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Load cars data
let carsData = [];

const loadCarsData = async () => {
    try {
        const fileContent = await fs.readFile('./data/cars.json');
        carsData = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error loading cars data:', error);
    }
};

// GET all cars
app.get('/cars', async (req, res) => {
    await loadCarsData();
    res.status(200).json({ cars: carsData });
});

// POST create a new car
app.post('/cars', async (req, res) => {
    const newCar = req.body;
    carsData.push(newCar);

    try {
        await fs.writeFile('./data/cars.json', JSON.stringify(carsData, null, 2));
        res.status(201).json({ message: 'Car created successfully', car: newCar });
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update a car by ID
app.put('/cars/:id', async (req, res) => {
    const { id } = req.params;
    const updatedCar = req.body;

    const carIndex = carsData.findIndex((car) => car.id === parseInt(id));
    if (carIndex === -1) {
        return res.status(404).json({ message: 'Car not found' });
    }

    carsData[carIndex] = { ...carsData[carIndex], ...updatedCar };

    try {
        await fs.writeFile('./data/cars.json', JSON.stringify(carsData, null, 2));
        res.status(200).json({ message: 'Car updated successfully', car: carsData[carIndex] });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a car by ID
app.delete('/cars/:id', async (req, res) => {
    const { id } = req.params;

    const updatedCarsData = carsData.filter((car) => car.id !== parseInt(id));

    if (updatedCarsData.length === carsData.length) {
        return res.status(404).json({ message: 'Car not found' });
    }

    carsData = updatedCarsData;

    try {
        await fs.writeFile('./data/cars.json', JSON.stringify(carsData, null, 2));
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 404
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    res.status(404).json({ message: '404 - Not Found' });
});

const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await loadCarsData();
});
