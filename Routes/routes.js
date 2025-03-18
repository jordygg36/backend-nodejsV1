const express = require("express");
const authController = require("../controllers/authController");
const multer = require("multer"); 
const path = require("path");
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
       
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('Tipo de archivo no permitido'), false);
        }
        cb(null, Date.now() + ext); 
    },
});

const upload = multer({ storage }); 

class Router{
    #router;//para que solo sea declarada una vez
    #usuariosController;
    #productosController;
    constructor(){
        this.#router = express.Router();
        Object.preventExtensions(this);
    }

    attachControllers = async (productosController, usuariosController) =>{
        //ataja los controladores, pues estos se tienen que iniciar primero
        this.#usuariosController=usuariosController;
        this.#productosController=productosController;
    }
    
    preparedRouting = async () => {
        // en esta parte con el this.#router nos ahorramos la sintaxis extensa de express.Router(), se utiliza la funcion get y 
        // se coloca la ruta productos, para que podamos usar el attach llamamos la variable global productosController y la enlazamos a la 
        //funcion getAll
        
        this.#router.get('/productos', this.#productosController.getAll);
        this.#router.get('/productos/:id', authController.verifyToken,this.#productosController.getOne);
        this.#router.post('/productos', authController.verifyToken,this.#productosController.create);
        this.#router.patch('/productos/:id',authController.verifyToken, this.#productosController.update);
        this.#router.delete('/productos/:id',authController.verifyToken, this.#productosController.delete);
        this.#router.get('/carrito', this.#productosController.getAllCarrito);
        this.#router.post('/carrito', this.#productosController.carrito);
        this.#router.delete('/carrito/:id', this.#productosController.deleteCar);


        this.#router.post('/login', authController.login);

        this.#router.get('/usuarios',authController.verifyToken, this.#usuariosController.getAll);
        this.#router.get('/usuarios/:id', this.#usuariosController.getOne);
        this.#router.post('/usuarios', authController.verifyToken, upload.single("imagen"), this.#usuariosController.create);
        this.#router.patch('/usuarios/:id', authController.verifyToken, upload.single("imagen"), this.#usuariosController.update);
        
        this.#router.delete('/usuarios/:id', authController.verifyToken, this.#usuariosController.delete);
    }

    getRouter = () => {
        return this.#router;
    } //retornar la variable router
}

module.exports = Router;  // exportar la clase