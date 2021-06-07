const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit:1024*1024*20, type:'application/json'});
const urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' })

const Connection = require('./server/common/connection');
const DBManager = require('./server/module/dbmanager');
const Config = require('./server/common/config');
const path = require('path');
app.use(express.static(__dirname + '/public'));
app.use(jsonParser);
app.use(urlencodedParser);

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
        // DBManager.addUser({username:'admin', password:'admin', firstName:"Admin", secondName:"Adminishvili", image:"", catalog:[]});
       
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
app.get('/Profile', (req, res) => {
    const answer = DBManager.getProfile(req.query.username, 0, 3);
    answer.then((user) => {
        let status ="";
        if(user === null){
            status = "Nonexistent";
            res.json({status: status});
        } else {
            status = "Existent";
            res.json({status: status, user:user});
        }
    }); 
});
app.get('/Profile/Edit', (req, res) => {
    const answer = DBManager.getUser(username);
    answer.then((user) => {
        let status = "";
        if(user === null){
            status = "Nonexistent";
        } else {
            status = "Successful";
        }
        res.json({status: status});
    }); 
});
app.post('/ProfileInfoChange', (req, res) => {
    DBManager.updateUser(req.body.username, req.body.password, req.body.firstName, req.body.secondName);
    if(req.body.image != undefined){
        DBManager.addAvatar(req.body.username, req.body.image);
        
    } 
    res.json({status: 'ok'}); //SOS sometimes faster ok response and avatar doesnt change
    
});
app.post('/LoadCatalog', (req, res) =>  {

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
app.post('/AddCatalog', (req, res) => {
    DBManager.addCatalog(req.body.username, req.body.catalog);
    res.json({status: 'ok'});
});

app.get('/',  (req, res) => {    
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});
app.get('*',  (req, res) => {    
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});


