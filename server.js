const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes.js');
const announcementRoutes = require('./routes/announcementRoutes.js');
const projectsRoutes = require('./routes/projectRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const port = process.env.PORT || 3000;
const path = require('path');

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(authRoutes);
app.use(projectsRoutes);
app.use(studentRoutes);
app.use('/admin', adminRoutes);
app.use(announcementRoutes);


app.listen(port, () => console.log(`Server started on port ${port}`));
