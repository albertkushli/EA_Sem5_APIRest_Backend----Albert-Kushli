import mongoose from 'mongoose';
import Usuario, { IUsuarioModel, IUsuario } from '../models/Usuario';
import Organizacion from '../models/Organizacion';
import { logActivity } from './activityService';

const createUsuario = async (data: Partial<IUsuario>): Promise<IUsuarioModel> => {
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    const savedUsuario = await usuario.save();

    if (data.organizacion) {
        await Organizacion.findByIdAndUpdate(
            data.organizacion,
            { $push: { usuarios: savedUsuario._id } }
        );
    }

    await logActivity("create", "user", savedUsuario._id);

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
        const updated = await usuario.save();

        await logActivity("update", "user", usuarioId);

        return updated;
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

    if (deletedUser) {
        await logActivity("delete", "user", usuarioId);
    }

    return deletedUser;
};

export default { 
    createUsuario, 
    getUsuario, 
    getAllUsuarios, 
    updateUsuario, 
    deleteUsuario 
};
