class Config {
    static get options(){
        return {
            port:3500,
            dbURL:'mongodb+srv://giorgi:giorgi@cluster0.1gvxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            dataBaseName:"NST",
            collectionName:"users",
        }
    }
}

module.exports = Config;