const usuariosModel = require("../models/usuariosModel");
const multer = require("multer");
const path = require("path");
class usuariosController{
    constructor(){
        Object.preventExtensions(this);
    }

    
    getAll = async (req, res) => {
            usuariosModel.fetchUser((result) => {
                if (!result) {
                    return res.status(500).json({ message: "Error al obtener usuarios" });
                }
                res.status(200).json(result);
            });
        }
    
    getOne = async (req, res) => {
            let object = { idusuarios: req.params.id };
    
            usuariosModel.fetchUserOne(object, (result) => {
                if (!result) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }
                res.status(200).json(result);
            });
        }
    
        create = async (req, res) => {
            let object = req.body;
            if (req.file) {
                // Guardar la imagen en la base de datos si se subió una
                object.imagen = req.file.filename; // Se guarda el nombre del archivo
            }
            usuariosModel.insertUser(object, (user, error) => {
                if (error) {
                    return res.status(500).json({ message: "Error al insertar el usuario", error });
                }
                res.status(201).json({ 
                    message: "Usuario creado con éxito",
                    usuario: user
                });
            });
        };
    
        update = async (req, res) => {
            const object = { ...req.body, idusuarios: req.params.id }; // Recibe los datos + ID
            if (req.file) {
                // Si se subió una nueva imagen, se actualiza la imagen
                object.imagen = req.file.filename;
            }
            usuariosModel.updateUser(object, (updateUser) => {
                if (!updateUser) {
                    return res.status(404).json({ message: "No se pudo actualizar el producto" });
                }
    
                res.status(200).json({ 
                    message: "Usuario actualizado correctamente",
                    producto: updateUser
                });
            });
        }
    
        delete = async (req, res) => {
            let object = { idusuarios: req.params.id };
    
            usuariosModel.deleteUser(object, (result) => {
                if (!result || result.affectedRows === 0) {
                    return res.status(404).json({ message: "No se pudo eliminar el usuario" });
                }
                res.status(200).json({ message: "Usuario eliminado correctamente" });
            });
        }

}

module.exports=usuariosController;