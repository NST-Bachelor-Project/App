const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Connection = require('./server/common/connection');
const DBManager = require('./server/module/dbmanager');
const Config = require('./server/common/config');
const path = require('path');
app.use(jsonParser) 
app.use(express.static(__dirname + '/public'));


const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(Config.options.dbURL,{          //Setup MongoClient
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err);
            return;
        }
        Connection.set(client.db(Config.options.dataBaseName)); //Set Connection
        // DBManager.addUser({username:'admin3', password:'admin3', firstName:"Admin3", secondName:"Admin3", image:"", catalog:[]});
       
});

app.listen(Config.options.port, () => {
    console.log(`Search app listening on port ${Config.options.port}!`);
});
app.post('/Login',  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const answer = DBManager.getUser(username);
    answer.then((user) => {
        let status = "";
        if(user === null){
            status = "Nonexistent";
        } else if(user.password === password){
            status = "Successful";
        } else if(user.password != password){
            status = "Wrong Password";
        }
        res.json({status: status});
    })  
});
app.get('/Register', (req, res) => {
    const username = req.query.username;
    const answer = DBManager.getUser(username);
    answer.then((user) => {
        let status = "";
        if(user === null){
            status = "Nonexistent";
        } else{
            status = "Existent";
        }
        res.json({status: status});
    })
});
app.post('/Register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const image = "";
    const catalog = [];
    DBManager.addUser({username:username, password:password, firstName:firstName, secondName:secondName, image:image, catalog:catalog});
    res.json({status:'ok'});
});
app.get('/',  (req, res) => {    
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});
app.get('*',  (req, res) => {    
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});


