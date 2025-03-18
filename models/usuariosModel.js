const bcrypt = require('bcryptjs');
const Connectiondb = require("../dataBase/connectiondb");

class Usuarios {

    constructor(){
        Object.preventExtensions(this);
    }

    fetchUser =async (callback)=>{
        const oConnectiondb= new Connectiondb();
        let conn=(await oConnectiondb.setupDatabase()).conn
        let sql= "SELECT * FROM usuarios";
        conn.query(sql, (error, result) => {
         if (error) {
             console.error("Error en fetchUsers:", error);
             return callback(null);
         }
         return callback(result);
         });

    }
    fetchUserOne =async (object, callback)=>{
        const oConnectiondb= new Connectiondb();
        let conn=(await oConnectiondb.setupDatabase()).conn
        let sql= "SELECT * FROM usuarios where idusuarios=?";
        conn.query(sql, [object.idusuarios], (error, result) => {
         if (error) {
             console.error("Error en fetchProductOne:", error);
             return callback(null);
         }
         return callback(result.length > 0 ? result[0] : null);
     });
    }


    insertUser = async (object, callback) => {
        const oConnectiondb = new Connectiondb();
        let conn = (await oConnectiondb.setupDatabase()).conn;
        
        try {
            // Hashear la contraseña antes de guardarla
            const salt = await bcrypt.genSalt(10);
            object.password = await bcrypt.hash(object.password, salt);
        
            // SQL con todos los campos de la tabla `usuarios`
            let sql = `INSERT INTO usuarios (idusuarios, nombre, apellido, rfc, email, direccion, idrol, fecha_creacion, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;

            conn.query(
                sql, 
                 [object.idusuario, object.nombre, object.apellido, object.rfc, object.email, object.direccion, object.idrol, object.password, object.imagen],
                (error, result) => {
                    if (error) {
                        callback(null, error);
                        return;
                    }

                    let getSql = "SELECT * FROM usuarios WHERE idusuarios = ?";
                    conn.query(getSql, [result.insertId], (err, user) => {
                        if (err) {
                            callback(null, err);
                            return;
                        }
                        callback(user[0], null);  // Devuelve el usuario insertado
                    });
                }
            );
        } catch (err) {
            callback(null, err);
        }
    };


    

    getUserByEmail = async (email) => {
        return new Promise(async (resolve, reject) => {
            try {
                const oConnectiondb = new Connectiondb();
                let conn = (await oConnectiondb.setupDatabase()).conn;
            
                let sql = "SELECT * FROM usuarios WHERE email = ?";
                conn.query(sql, [email], (error, result) => {
                    if (error) return reject(error);
                    resolve(result.length > 0 ? result[0] : null);
                });
            } catch (error) {
                reject(error);
            }
        });
    };
    

    

   updateUser =async (object, callback)=>{
        const oConnectiondb= new Connectiondb();
        let conn=(await oConnectiondb.setupDatabase()).conn;
        let sql= "UPDATE usuarios SET ? WHERE idusuarios=?";

        conn.query(sql, [object, object.idusuarios], (error, result) => {
         if (error) throw error;

         if (result.affectedRows === 0) {
             return callback(null); 
         }

      
         let getSql = "SELECT * FROM usuarios WHERE idusuarios = ?";
         conn.query(getSql, [object.idusuarios], (err, updatedProduct) => {
             if (err) throw err;
             callback(updatedProduct[0]); 
         });
     });
   }

   deleteUser =async (object, callback)=>{
      const oConnectiondb= new Connectiondb();
      let conn=(await oConnectiondb.setupDatabase()).conn
      let sql= "DELETE FROM usuarios WHERE idusuarios= ?";

      conn.query(sql, [object.idusuarios], (error, result) => {
         if (error) {
             console.error("Error en deleteProduct:", error);
             return callback(null);
         }
         return callback(result);
      });
  }
}

module.exports = Usuarios = new Usuarios();