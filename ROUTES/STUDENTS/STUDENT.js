const express = require("express");
const StudentRoute = express.Router();
const DepartmentRoute = express.Router();
const Students = require("../DATABASE/SCHEMA/StudentSchema.js");
const Departments = require("../DATABASE/SCHEMA/DepartmentSchema.js");

StudentRoute.get('/', async (req, res) => {
    try {
        const queryparams = req.query;
        const filters = {};
        
        if (queryparams.name) {
            filters.name = {
                $regex: `^${queryparams.name}`,
                $options: "i"
            };
        }
        if (queryparams.department) {
            filters.department = queryparams.department;
        }

        const students = await Students.find(filters);
        res.json(students);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

StudentRoute.post("/", async (req, res) => {
    try {
        const studentData = req.body;
        const existingStudent = await Students.findOne({ registrationNumber: studentData.registrationNumber });
        if (existingStudent) {
            return res.status(400).json({
                message: "Registration Number already exists"
            });
        }
        const department = await Departments.findOne({ name: studentData.department });
        if (!department) {
            return res.status(400).json({
                message: "Department does not exist"
            });
        }

        const newStudent = new Students(studentData);
        await newStudent.save();

        res.json({
            message: "Student details added successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
StudentRoute.put("/:id", async (req, res) => {
    try {
        const studentID = req.params.id;
        const updatedStudentData = req.body;
        if (updatedStudentData.department) {
            const department = await Departments.findOne({ name: updatedStudentData.department });
            if (!department) {
                return res.status(400).json({
                    message: "Department does not exist"
                });
            }
        }

        const response = await Students.findByIdAndUpdate(studentID, updatedStudentData, { new: true });
        if (!response) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student details updated successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
StudentRoute.delete("/:id", async (req, res) => {
    try {
        const studentID = req.params.id;
        const response = await Students.findByIdAndDelete(studentID);
        if (!response) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        res.json({
            message: "Student details deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
StudentRoute.get('/department/:name', async (req, res) => {
    try {
        const departmentName = req.params.name;
        const students = await Students.find({ department: departmentName });

        if (students.length === 0) {
            return res.status(404).json({
                message: "No students found in this department"
            });
        }

        res.json(students);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
DepartmentRoute.get('/', async (req, res) => {
    try {
        const queryparams = req.query;
        const filters = {};
        
        if (queryparams.name) {
            filters.name = {
                $regex: `^${queryparams.name}`,
                $options: "i"
            };
        }

        const departments = await Departments.find(filters);
        res.json(departments);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

DepartmentRoute.post("/", async (req, res) => {
    try {
        const departmentData = req.body;

        const existingDepartment = await Departments.findOne({ name: departmentData.name });
        if (existingDepartment) {
            return res.status(400).json({
                message: "Department name already exists"
            });
        }

        const newDepartment = new Departments(departmentData);
        await newDepartment.save();

        res.json({
            message: "Department added successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

DepartmentRoute.delete("/:name", async (req, res) => {
    try {
        const departmentName = req.params.name;

        const studentsInDepartment = await Students.find({ department: departmentName });
        if (studentsInDepartment.length > 0) {
            return res.status(400).json({
                message: "Cannot delete department with existing students"
            });
        }

        const response = await Departments.findOneAndDelete({ name: departmentName });
        if (!response) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.json({
            message: "Department deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

module.exports = { StudentRoute, DepartmentRoute };

    