import mongoose from 'mongoose';
import Organizacion, { IOrganizacionModel, IOrganizacion } from '../models/Organizacion';
import { logActivity } from './activityService';

const createOrganizacion = async (data: Partial<IOrganizacion>): Promise<IOrganizacionModel> => {
    const organizacion = new Organizacion({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    const saved = await organizacion.save();

    await logActivity("create", "organization", saved._id);

    return saved;
};

const getOrganizacion = async (organizacionId: string): Promise<IOrganizacionModel | null> => {
    return await Organizacion.findById(organizacionId).populate('usuarios');
};

const getAllOrganizaciones = async (): Promise<IOrganizacion[]> => {
    return await Organizacion.find()
        .populate('usuarios')
        .lean();
};

const getUsuariosDeOrganizacion = async (organizacionId: string) => {
    const organizacion = await Organizacion.findById(organizacionId)
        .populate('usuarios')
        .lean();

    return organizacion ? organizacion.usuarios : null;
};

const updateOrganizacion = async (organizacionId: string, data: Partial<IOrganizacion>): Promise<IOrganizacionModel | null> => {
    const organizacion = await Organizacion.findById(organizacionId);
    if (organizacion) {
        organizacion.set(data);
        const updated = await organizacion.save();

        await logActivity("update", "organization", organizacionId);

        return updated;
    }
    return null;
};

const deleteOrganizacion = async (organizacionId: string): Promise<IOrganizacionModel | null> => {
    const deleted = await Organizacion.findByIdAndDelete(organizacionId);

    if (deleted) {
        await logActivity("delete", "organization", organizacionId);
    }

    return deleted;
};

const addUsuarioToOrganizacion = async (organizacionId: string, usuarioId: string): Promise<IOrganizacionModel | null> => {
    const updated = await Organizacion.findByIdAndUpdate(
        organizacionId,
        { $push: { usuarios: new mongoose.Types.ObjectId(usuarioId) } },
        { new: true }
    ).populate('usuarios');

    await logActivity("add-user", "organization", organizacionId);

    return updated;
};

const removeUsuarioFromOrganizacion = async (organizacionId: string, usuarioId: string): Promise<IOrganizacionModel | null> => {
    const updated = await Organizacion.findByIdAndUpdate(
        organizacionId,
        { $pull: { usuarios: new mongoose.Types.ObjectId(usuarioId) } },
        { new: true }
    ).populate('usuarios');

    await logActivity("remove-user", "organization", organizacionId);

    return updated;
};

export default { 
    createOrganizacion, 
    getOrganizacion, 
    getAllOrganizaciones, 
    getUsuariosDeOrganizacion, 
    updateOrganizacion, 
    deleteOrganizacion,
    addUsuarioToOrganizacion,    
    removeUsuarioFromOrganizacion 
};
