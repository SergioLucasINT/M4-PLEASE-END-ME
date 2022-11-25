const express = require('express'); 
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(express.json()); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
const userCred = require('./tools/routes/userCred.js');

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'atech_proj'
});

const port = 3000;
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});

// Login page
app.use('/', userCred);
app.use('/users', userCred);
app.use('/users/register', userCred);
app.use('/users/auth', userCred);