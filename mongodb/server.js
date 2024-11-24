const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Replace with your MongoDB connection string
const mongoUri = 'mongodb+srv://rakesh:1234@cluster0.qpcvo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create a patient schema
const patientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    doctor: { type: String, required: true },
    medicine: { type: String, required: true }
});

// Create a patient model
const Patient = mongoose.model('Patient', patientSchema);

app.use(express.json()); // To parse JSON request bodies

// Create a new patient (POST /api/patients)
app.post('/api/patients', async (req, res) => {
    const { id, name, doctor, medicine } = req.body;

    try {
        const existingPatient = await Patient.findOne({ id });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient with this ID already exists' });
        }

        const newPatient = new Patient({ id, name, doctor, medicine });
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add patient', error });
    }
});

// Read all patients (GET /api/patients)
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch patients', error });
    }
});

// Update a patient by ID (PUT /api/patients/:id)
app.put('/api/patients/:id', async (req, res) => {
    const patientId = req.params.id;
    const { name, doctor, medicine } = req.body;

    try {
        const updatedPatient = await Patient.findOneAndUpdate({ id: patientId }, { name, doctor, medicine }, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update patient', error });
    }
});

// Delete a patient by ID (DELETE /api/patients/:id)
app.delete('/api/patients/:id', async (req, res) => {
    const patientId = req.params.id;

    try {
        const deletedPatient = await Patient.findOneAndDelete({ id: patientId });
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete patient', error });
    }
});

// Serve the frontend (index.html)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
