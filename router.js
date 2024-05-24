const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, 'data.json');


const readHospitals = (callback) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return callback(err);
    }
    callback(null, JSON.parse(data));
  });
};

const writeHospitals = (data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};

// GET
router.get('/getHospitals', (req, res) => {
  readHospitals((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(data);
  });
});

// POST
router.post('/postHospitals', (req, res) => {
  const newHospital = req.body;
  readHospitals((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    newHospital.id = data.hospitals.length ? data.hospitals[data.hospitals.length - 1].id + 1 : 1;
    data.hospitals.push(newHospital);
    writeHospitals(data, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write data' });
      }
      res.status(201).json(newHospital);
    });
  });
});

// PUT
router.put('/putHospitals/:id', (req, res) => {
  const hospitalId = parseInt(req.params.id, 10);
  const updatedInfo = req.body;
  readHospitals((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const index = data.hospitals.findIndex(hospital => hospital.id === hospitalId);
    if (index !== -1) {
      data.hospitals[index] = { ...data.hospitals[index], ...updatedInfo, id: hospitalId };
      writeHospitals(data, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to write data' });
        }
        res.json(data.hospitals[index]);
      });
    } else {
      res.status(404).json({ error: 'Hospital not found' });
    }
  });
});

// DELETE
router.delete('/hospitals/:id', (req, res) => {
  const hospitalId = parseInt(req.params.id, 10);
  readHospitals((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const newData = data.hospitals.filter(hospital => hospital.id !== hospitalId);
    if (newData.length !== data.hospitals.length) {
      data.hospitals = newData;
      writeHospitals(data, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to write data' });
        }
        res.json({ message: 'Hospital deleted' });
      });
    } else {
      res.status(404).json({ error: 'Hospital not found' });
    }
  });
});

module.exports = router;

