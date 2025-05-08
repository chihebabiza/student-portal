const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// app.use('/api/goals', require('./routes/goalRoutes'));
// app.use('/', require('./routes/userRoutes'));
app.use(authRoutes);


app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
