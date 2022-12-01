const express = require('express'); 
const app = express();
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');

// Functions
const functions = require('../functions/crud');
const editAreas = require('./editAreas');

app.use(express.json()); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

router.get('/', (req, res) => {
  res.render('pages/login');
});

var connection_info = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'atech_proj'
};

var query_data = {
  table: '`login_auth`',
  insert_columns: '`funcid`, `password`'
};

router.get('/users', (req, res) => {

  var con = mysql.createConnection(connection_info);

  con.query(functions.readNode(query_data['table'], '*'), (err, users) => {
    res.json(users);
  });
});

router.post('/users/new', (req, res) => {

  var con = mysql.createConnection(connection_info);

  console.log(req.body);

  con.query(functions.readNode(query_data['table'], '*'), async (err, users) => {
    const user = users.find(user => user.user_creation_token == req.body.user_creation_token)
    if (user == null) {
      return res.status(400).send('Invalid User Creation Token');
    } else {
      return res.status(201).send('Valid Token');
    }
  });

});

router.post('/users/register', async (req,res) => {

  var con = mysql.createConnection(connection_info);

  con.query(functions.readNode(query_data['table'], '*'), async (err, users) => {
      try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);

          con.query(functions.createNode(query_data['table'], query_data['insert_columns'], "'" + req.body.funcid + "', '" + hashedPassword + "'"));

          res.status(201).send();
      } catch {
          res.status(500).send();
      }
  });
});

router.post('/users/auth', async (req, res) => {

  var con = mysql.createConnection(connection_info);

  console.log(req.body);

  con.query(functions.readNode(query_data['table'], '*'), async (err, users) => {
    const user = users.find(user => user.funcid == req.body.funcid)
    if (user == null) {
      return res.status(400).send('Cannot find user');
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        res.redirect('/edit');
      } else {
        res.send('Not Allowed');
      }
    } catch {
      res.status(500).send();
    }
  });
});

module.exports = router;