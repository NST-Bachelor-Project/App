const Connection = require("../common/connection");

class DBManager{
    /* Getters */
    static getUser(username){
        return (Connection.db.collection('users')).findOne({username: username}, {fields: {username:1, password:1}});
    }
    static findUser(username){
        const collection = (Connection.db.collection('users'));
        const regexUsername = new RegExp(username, 'gi');
        const query = {username:{$regex: regexUsername}};
        return collection.find(query, {fields:{username:1}});
    }
    static getProfile(username){
        // return (Connection.db.collection('users')).find({username: username}, {"catalog": {$slice:3}}).toArray();
        return (Connection.db.collection('users')).findOne({username: username});
    }
    static getProfileInfo(username){
        return (Connection.db.collection('users')).findOne({username: username}, {fields: {catalog:0}});
    }
    
    static getCatalog(username, offset, limit){
        return (Connection.db.collection('users')).find({username:username},{projection:{catalog:{$slice:[offset, limit]}}});
    }
    static getOthers(offset, limit){
        return (Connection.db.collection('users')).find({},{projection:{catalog:{$slice:[offset, limit]}}});
    }
    /* Setters */
    static addUser(data){
        const newUser = {username: data.username, password: data.password, firstName: data.firstName, secondName: data.secondName, image:data.image, catalog:data.catalog};
        Connection.db.collection('users').insertOne(newUser, (err, res) => {
            if(err){
                console.error(err);
                return;
            }
            console.log(`Inserted - ${data.username}`);
        });
    }
    static updateUser(username, password, firstName, secondName){
        (Connection.db.collection('users')).updateOne({username:username}, {$set: {password:password, firstName:firstName, secondName:secondName}}, (err, res) => {
            if(err){
                console.error(err);
                return;
            }
            // console.log(`Updated ${username}`);
        });
    }
    static addCatalog(username, catalog){
        (Connection.db.collection('users')).updateOne({username:username}, {$push: {catalog:catalog}}, (err, res) => {
            if(err){
                console.error(err);
                return;
            }
            // console.log(`Catalog added - ${username}`);
        });
    }
    static addAvatar(username, image){
        return (Connection.db.collection('users')).updateOne({username:username}, {$set: {image:image}});
    }   
    static deleteRow(username, index){
        let res = (Connection.db.collection('users')).findOne({username:username}, {fields: {catalog:1}});
        res.then((data) => {
            data.catalog.splice(index,1);
            (Connection.db.collection('users')).updateOne({username:username}, {$set : {catalog : data.catalog}}, (err, res) => {
                if(err){
                    console.error(err);
                    return;
                }
                console.log(`Removed ${index} Row from ${username}`);
            });
            
        });
       
        
    }
}
module.exports = DBManager;
