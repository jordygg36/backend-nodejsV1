const productosModel = require("../models/productosModel");
class productosController{
    constructor(){
        Object.preventExtensions(this);
    }

    getAll = async (req, res) => {
        productosModel.fetchProduct((result) => {
            if (!result) {
                return res.status(500).json({ message: "Error al obtener los productos" });
            }
            res.status(200).json(result);
        });
    }

    getAllCarrito = async (req, res) => {
        productosModel.fetchCarrito((result) => {
            if (!result) {
                return res.status(500).json({ message: "Error al mostrar el carrito" });
            }
            res.status(200).json(result);
        });
    }

    getOne = async (req, res) => {
        let object = { idproducto: req.params.id };

        productosModel.fetchProductOne(object, (result) => {
            if (!result) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.status(200).json(result);
        });
    }

    create = async (req, res) => {
        let object = req.body;

        productosModel.insertProduct(object, (product) => {
            if (!product) {
                return res.status(500).json({ message: "Error al insertar el producto" });
            }
            res.status(201).json({ 
                message: "Producto creado con éxito",
                producto: product
            });
        });
    };

    carrito = async (req, res) => {
        let object = req.body;

        productosModel.insertProductCarrito(object, (product) => {
            if (!product) {
                return res.status(500).json({ message: "Error al agregar al carrito" });
            }
            res.status(201).json({ 
                message: "Producto agregado al carrito con éxito",
                producto: product
            });
        });
    };

    update = async (req, res) => {
        let object = { ...req.body, idproductos: req.params.id }; // Recibe los datos + ID

        productosModel.updateProduct(object, (updatedProduct) => {
            if (!updatedProduct) {
                return res.status(404).json({ message: "No se pudo actualizar el producto" });
            }

            res.status(200).json({ 
                message: "Producto actualizado correctamente",
                producto: updatedProduct
            });
        });
    }

    delete = async (req, res) => {
        let object = { idproductos: req.params.id };

        productosModel.deleteProduct(object, (result) => {
            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: "No se pudo eliminar el producto" });
            }
            res.status(200).json({ message: "Producto eliminado correctamente" });
        });
    }
    deleteCar = async (req, res) => {
        let object = { idcarrito: req.params.id };

        productosModel.deleteCarritos(object, (result) => {
            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: "No se pudo eliminar el producto del carrito" });
            }
            res.status(200).json({ message: "Producto eliminado del carrito correctamente" });
        });
    }
}





module.exports=productosController;