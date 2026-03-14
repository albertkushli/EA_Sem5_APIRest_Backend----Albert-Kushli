import mongoose from 'mongoose';
import Organizacion, { IOrganizacionModel, IOrganizacion } from '../models/Organizacion';

const createOrganizacion = async (data: Partial<IOrganizacion>): Promise<IOrganizacionModel> => {
    const organizacion = new Organizacion({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await organizacion.save();
};

const getOrganizacion = async (organizacionId: string): Promise<IOrganizacionModel | null> => {
    return await Organizacion.findById(organizacionId).populate('usuarios');
};

// Quitamos el "export" de aquí
const getAllOrganizaciones = async (): Promise<IOrganizacion[]> => {
    // Usamos populate('usuarios') para que devuelva los datos enteros y .lean() para rendimiento
    return await Organizacion.find()
        .populate('usuarios')
        .lean(); 
};

const getUsuariosDeOrganizacion = async (organizacionId: string) => {
    const organizacion = await Organizacion.findById(organizacionId)
        .populate('usuarios')
        .lean();
    
    // Si la organización existe, devolvemos solo el array de usuarios. Si no, null.
    return organizacion ? organizacion.usuarios : null;
};

const updateOrganizacion = async (organizacionId: string, data: Partial<IOrganizacion>): Promise<IOrganizacionModel | null> => {
    const organizacion = await Organizacion.findById(organizacionId);
    if (organizacion) {
        organizacion.set(data);
        return await organizacion.save();
    }
    return null;
};

const deleteOrganizacion = async (organizacionId: string): Promise<IOrganizacionModel | null> => {
    return await Organizacion.findByIdAndDelete(organizacionId);
};

export default { 
    createOrganizacion, 
    getOrganizacion, 
    getAllOrganizaciones, 
    getUsuariosDeOrganizacion, 
    updateOrganizacion, 
    deleteOrganizacion 
};
