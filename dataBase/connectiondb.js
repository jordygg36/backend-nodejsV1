const conf = require('./configDataBase.json');
const mysql = require("mysql2");

class DBManager {


    constructor() {
        Object.preventExtensions(this);
    }

    setupDatabase = async () => {
        let conn = new mysql.createConnection(conf.DevConfig.db);
        conn.connect(
            function (err){
                if(err){
                    console.log("!!! Error en la conexión");
                }else{
                    console.log("Conexión establecida");
                }
            }
        );
        return {conn};
    }
} 

module.exports = DBManager;