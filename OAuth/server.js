const express = require('express');
const { auth } = require('express-openid-connect');
const path = require('path');

const app = express();
const port = 3000;

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'yn6nudwTF4JwvFpDRxA05iP75OBEzzN9',
  issuerBaseURL: 'https://dev-oldtu4ya44gaswzc.us.auth0.com'
};

// Auth router for handling login, logout, and callback routes
app.use(auth(config));

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory array to store patient data
let patients = [];

// Serve static files from the 'public' folder (for HTML and frontend assets)
app.use(express.static(path.join(__dirname, 'public')));

// Authentication check for protected routes
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/login');
  }
});

// API to handle patient data
app.post('/api/patients', (req, res) => {
  const { id, name, doctor, medicine } = req.body;
  if (patients.some(patient => patient.id === id)) {
    return res.status(400).json({ message: 'Patient with this ID already exists' });
  }
  const newPatient = { id, name, doctor, medicine };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.put('/api/patients/:id', (req, res) => {
  const patientId = req.params.id;
  const { name, doctor, medicine } = req.body;
  const patientIndex = patients.findIndex(patient => patient.id === patientId);
  if (patientIndex === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  if (name) patients[patientIndex].name = name;
  if (doctor) patients[patientIndex].doctor = doctor;
  if (medicine) patients[patientIndex].medicine = medicine;
  res.json(patients[patientIndex]);
});

app.delete('/api/patients/:id', (req, res) => {
  const patientId = req.params.id;
  const patientIndex = patients.findIndex(patient => patient.id === patientId);
  if (patientIndex === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  patients.splice(patientIndex, 1);
  res.json({ message: 'Patient deleted successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
