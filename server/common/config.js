class Config {
    static get options(){
        return {
            port:3500,
            dbURL:'mongodb+srv://giorgi:giorgi@cluster0.gzlfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            dataBaseName:"NST",
            collectionName:"users",
        }
    }
}

module.exports = Config;