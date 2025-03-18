
const Connectiondb = require("../dataBase/connectiondb");

class Productos {

    constructor(){
        Object.preventExtensions(this);
    }

    fetchProduct =async (callback)=>{
        const oConnectiondb= new Connectiondb();
        let conn=(await oConnectiondb.setupDatabase()).conn
        let sql= "SELECT * FROM productos";
        conn.query(sql, (error, result) => {
         if (error) {
             console.error("Error en fetchProduct:", error);
             return callback(null);
         }
         return callback(result);
         });

    }

    fetchCarrito =async (callback)=>{
        const oConnectiondb= new Connectiondb();
        let conn=(await oConnectiondb.setupDatabase()).conn
        let sql= `SELECT carrito.idcarrito,
        productos.idproductos,
        productos.nombre as 'producto',
        productos.precio,
        productos.imagen
        FROM productos, carrito
        WHERE carrito.idproductos=productos.idproductos
        `;

        conn.query(sql, (error, result) => {
         if (error) {
             console.error("Error en fetchCarrito:", error);
             return callback(null);
         }
         return callback(result);
         });
        
    }

    fetchProductOne =async (object, callback)=>{
        const oConnectiondb= new Connectiondb();
        let conn=(await oConnectiondb.setupDatabase()).conn
        let sql= "SELECT * FROM productos where idproductos=?";
        conn.query(sql, [object.idproductos], (error, result) => {
         if (error) {
             console.error("Error en fetchProductOne:", error);
             return callback(null);
         }
         return callback(result.length > 0 ? result[0] : null);
     });
    }

    I

   insertProduct =async (object, callback)=>{
      const oConnectiondb= new Connectiondb();
      let conn=(await oConnectiondb.setupDatabase()).conn;
      let sql= "INSERT INTO productos SET ?";
      
      conn.query(sql, object, (error, result) => {
         if (error) throw error;

         // Obtener el producto insertado
         let getSql = "SELECT * FROM productos WHERE idproductos = ?";
         conn.query(getSql, [result.insertId], (err, product) => {
             if (err) throw err;
             callback(product[0]); // Devuelve el producto insertado
         });
     });
 }
    insertProductCarrito =async (object, callback)=>{
      const oConnectiondb= new Connectiondb();
      let conn=(await oConnectiondb.setupDatabase()).conn;
      let sql= "INSERT INTO carrito SET ?";
      
      conn.query(sql, object, (error, result) => {
         if (error) throw error;

         // Obtener el producto insertado
         let getSql = `SELECT carrito.idcarrito,
productos.idproductos,
usuarios.nombre,
productos.nombre as 'producto',
productos.precio
FROM usuarios, productos, carrito
WHERE carrito.idproductos=productos.idproductos AND carrito.idcarrito=?;
`;
         conn.query(getSql, [result.insertId], (err, product) => {
             if (err) throw err;
             callback(product[0]); // Devuelve el producto insertado
         });
     });
 }

    
    

   updateProduct =async (object, callback)=>{
        const oConnectiondb= new Connectiondb();
        let conn=(await oConnectiondb.setupDatabase()).conn;
        let sql= "UPDATE productos SET ? WHERE idproductos=?";

        conn.query(sql, [object, object.idproductos], (error, result) => {
         if (error) throw error;

         if (result.affectedRows === 0) {
             return callback(null); 
         }

      
         let getSql = "SELECT * FROM productos WHERE idproductos = ?";
         conn.query(getSql, [object.idproductos], (err, updatedProduct) => {
             if (err) throw err;
             callback(updatedProduct[0]); 
         });
     });
   }

   deleteProduct =async (object, callback)=>{
      const oConnectiondb= new Connectiondb();
      let conn=(await oConnectiondb.setupDatabase()).conn
      let sql= "DELETE FROM productos WHERE idproductos= ?";

      conn.query(sql, [object.idproductos], (error, result) => {
         if (error) {
             console.error("Error en deleteProduct:", error);
             return callback(null);
         }
         return callback(result);
      });
  }

  deleteCarritos =async (object, callback)=>{
    const oConnectiondb= new Connectiondb();
    let conn=(await oConnectiondb.setupDatabase()).conn
    let sql= "DELETE FROM carrito WHERE idcarrito= ?";

    conn.query(sql, [object.idcarrito], (error, result) => {
       if (error) {
           console.error("Error en deleteCarritos:", error);
           return callback(null);
       }
       return callback(result);
    });
}

}
module.exports= new Productos();