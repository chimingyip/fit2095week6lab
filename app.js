const mongoose = require('mongoose');
const express = require("express");
const ejs = require("ejs");
const path = require('path');

const Doctor = require('./models/doctorschema');
const Patient = require('./models/patientschema');

const app = express();
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/css"));
app.use(express.static("public/img"));
const db = "mongodb://localhost:27017/fit2095db";

var viewsPath = __dirname + "/views/";

app.listen(8080);
console.log("Listening on port 8080");

app.post('/postdoctor', function (req, res) {
    let newDoctorObj = req.body;
    let newDoctor = new Doctor({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: newDoctorObj.firstname,
            lastName: newDoctorObj.lastname,    
        },
        dob: newDoctorObj.dob,
        address: {
            state: newDoctorObj.state,
            suburb: newDoctorObj.suburb,
            street: newDoctorObj.street,
            unit: newDoctorObj.unit,
        },
        numPatients: newDoctorObj.numpatients
    });
    newDoctor.save(function (err) {
        if (err) {
            let fileName = viewsPath + "invaliddata.html";
            res.sendFile(fileName);
        }
        else {
            console.log('Added new doctor to the database');
            res.redirect("/listdoctors");

        }
    });
});

app.post('/postpatient', function (req, res) {
    let newPatientObj = req.body;
    let newPatient = new Patient({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: newPatientObj.firstname,
            lastName: newPatientObj.lastname,    
        },
        doctor: newPatientObj.doctor,
        age: newPatientObj.age,
        dateVisited: newPatientObj.datevisited,
        caseDescription: newPatientObj.casedescription
    });
    newPatient.save(function (err) {
        if (err) {
            let fileName = viewsPath + "invaliddata.html";
            res.sendFile(fileName);
        }
        else {
            console.log('Added new patient to the database');
            res.redirect("/listpatients");

        }
    });
});

app.post('/deleteapatient', (req, res) => {
    let patientObj = req.body;
    Patient.deleteOne({ 'name.firstName': patientObj.firstname, 'name.lastName': patientObj.lastname }, function (err, doc) {
        console.log('Deleted patient');
    });
    res.redirect('/listpatients');
});

app.post('/updatenumpatients', (req, res) => {
    let obj = req.body;
    Doctor.updateOne({ '_id': obj.id }, { $set: { 'numPatients': obj.numpatients } }, function (err, doc) {
        console.log('Updated number of patients');
    });
    res.redirect('/listdoctors');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/adddoctor', function (req, res) {
    let fileName = viewsPath + 'adddoctor.html';
    res.sendFile(fileName);
});

app.get('/addpatient', (req, res) => {
    let fileName = viewsPath + 'addpatient.html';
    res.sendFile(fileName);
});

app.get('/listdoctors', (req, res) => {
    Doctor.find({}, (err, docs) => {
        res.render("listdoctors", {doctorsDb: docs});
    });
});

app.get('/listpatients', (req, res) => {
    Patient.find({}, (err, docs) => {
        res.render("listpatients", {patientsDb: docs});
    });
});

app.get('/deletepatient', (req, res) => {
    let fileName = viewsPath + 'deletepatient.html';
    res.sendFile(fileName);
});

app.get('/updatedoctor', (req, res) => {
    let fileName = viewsPath + 'updatedoctor.html';
    res.sendFile(fileName);
});

mongoose.connect(db, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Connected successfully');
});
