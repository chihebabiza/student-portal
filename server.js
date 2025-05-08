const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');
const announcementRoutes = require('./routes/announcementRoutes.js');
const cookieParser = require('cookie-parser');
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

// app.use('/api/goals', require('./routes/goalRoutes'));
// app.use('/', require('./routes/userRoutes'));
app.use(authRoutes);
app.use(announcementRoutes);


app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
