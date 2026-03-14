import mongoose from 'mongoose';
import Usuario, { IUsuarioModel, IUsuario } from '../models/Usuario';
import Organizacion from '../models/Organizacion';

const createUsuario = async (data: Partial<IUsuario>): Promise<IUsuarioModel> => {
    // 1. Instanciamos el usuario con un nuevo ID
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    
    // 2. Guardamos el usuario en la base de datos
    const savedUsuario = await usuario.save();

    // 3. 👉 LÓGICA DEL VECTOR: Sincronizamos la Organización ($push)
    if (data.organizacion) {
        await Organizacion.findByIdAndUpdate(
            data.organizacion,
            { $push: { usuarios: savedUsuario._id } } 
        );
    }

    // 4. Devolvemos el usuario guardado
    return savedUsuario;
};

const getUsuario = async (usuarioId: string): Promise<IUsuarioModel | null> => {
    return await Usuario.findById(usuarioId).populate('organizacion');
};

const getAllUsuarios = async (): Promise<IUsuarioModel[]> => {
    return await Usuario.find().populate('organizacion');
};

const updateUsuario = async (usuarioId: string, data: Partial<IUsuario>): Promise<IUsuarioModel | null> => {
    const usuario = await Usuario.findById(usuarioId);
    if (usuario) {
        usuario.set(data);
        return await usuario.save();
    }
    return null;
};

const deleteUsuario = async (usuarioId: string): Promise<IUsuarioModel | null> => {
    const deletedUser = await Usuario.findByIdAndDelete(usuarioId);
    
   
    if (deletedUser && deletedUser.organizacion) {
        await Organizacion.findByIdAndUpdate(
            deletedUser.organizacion,
            { $pull: { usuarios: deletedUser._id } }
        );
    }
    
    return deletedUser;
};

export default { createUsuario, getUsuario, getAllUsuarios, updateUsuario, deleteUsuario };