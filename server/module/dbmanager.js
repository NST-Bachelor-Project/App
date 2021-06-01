const Connection = require("../common/connection");

class DBManager{
    static getUser(username){
        return (Connection.db.collection('users')).findOne({username: username}, {fields: {username:1, password:1}});
    }
    static getProfile(username){
        return (Connection.db.collection('users')).findOne({username: username});
    }
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

    
}
module.exports = DBManager;
