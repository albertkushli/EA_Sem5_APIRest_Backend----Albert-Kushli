import mongoose from 'mongoose';
import Usuario, { IUsuarioModel, IUsuario } from '../models/Usuario';
import Organizacion from '../models/Organizacion';

const createUsuario = async (data: Partial<IUsuario>): Promise<IUsuarioModel> => {
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await usuario.save();

    // Guardamos el usuario primero
    const savedUsuario = await usuario.save();

    // 👉 2. LÓGICA DEL VECTOR MANUAL: Sincronizamos la Organización
    // Verificamos si al crear el usuario se le ha asignado una organización
    if (data.organizacion) {
        await Organizacion.findByIdAndUpdate(
            data.organizacion,
            { $push: { usuarios: savedUsuario._id } } // Añadimos el ID del usuario al array
        );
    }

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
    
    // 👉 BONUS (Opcional pero muy recomendado): 
    // Si borras un usuario, deberías sacarlo del array de la organización ($pull)
    if (deletedUser && deletedUser.organizacion) {
        await Organizacion.findByIdAndUpdate(
            deletedUser.organizacion,
            { $pull: { usuarios: deletedUser._id } }
        );
    }
    
    return deletedUser;
};

export default { createUsuario, getUsuario, getAllUsuarios, updateUsuario, deleteUsuario };