const express = require("express");
const app = express();

const { StudentRoute, DepartmentRoute } = require('../ROUTES/STUDENTS/STUDENT.js');
app.use(express.json());


app.use('/students', StudentRoute);
app.use('/departments', DepartmentRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
