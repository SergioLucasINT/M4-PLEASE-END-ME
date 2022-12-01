const express = require('express'); 
const app = express();
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');

// Functions
const functions = require('../functions/crud');

app.use(express.json()); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

router.get('/', (req, res) => {
    var con = mysql.createConnection(connection_info);

    con.query(functions.readNode(query_data['table'], '*'), (err, areas) => {
        res.render('pages/edit', {areas: areas});
    });
});

var connection_info = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'atech_proj'
};

var query_data = {
  table: '`areas`',
  insert_columns: '`name`'
};

router.get('/areas', (req, res) => {

    var con = mysql.createConnection(connection_info);

    con.query(functions.readNode(query_data['table'], '*'), (err, areas) => {
      res.json(areas), {areas: areas};
    });

});
module.exports = router;