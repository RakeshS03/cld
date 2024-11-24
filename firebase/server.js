const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON request bodies

// In-memory array to store patient data
let patients = [];

// Create a new patient (POST /api/patients)
app.post('/api/patients', (req, res) => {
    const { id, name, doctor, medicine } = req.body;
    
    // Check if patient ID already exists
    if (patients.some(patient => patient.id === id)) {
        return res.status(400).json({ message: 'Patient with this ID already exists' });
    }
    
    const newPatient = { id, name, doctor, medicine };
    patients.push(newPatient);
    res.status(201).json(newPatient); // Return the newly added patient
});

// Read all patients (GET /api/patients)
app.get('/api/patients', (req, res) => {
    res.json(patients); // Return the list of patients
});

// Update a patient by ID (PUT /api/patients/:id)
app.put('/api/patients/:id', (req, res) => {
    const patientId = req.params.id;
    const { name, doctor, medicine } = req.body;

    const patientIndex = patients.findIndex(patient => patient.id === patientId);
    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Patient not found' });
    }

    // Update patient information
    if (name) patients[patientIndex].name = name;
    if (doctor) patients[patientIndex].doctor = doctor;
    if (medicine) patients[patientIndex].medicine = medicine;

    res.json(patients[patientIndex]); // Return the updated patient
});

// Delete a patient by ID (DELETE /api/patients/:id)
app.delete('/api/patients/:id', (req, res) => {
    const patientId = req.params.id;

    const patientIndex = patients.findIndex(patient => patient.id === patientId);
    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Patient not found' });
    }

    patients.splice(patientIndex, 1); // Remove patient from array
    res.json({ message: 'Patient deleted successfully' });
});

// Serve the frontend (index.html)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
