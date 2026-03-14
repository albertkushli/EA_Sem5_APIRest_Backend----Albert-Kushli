import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import OrganizacionService from '../services/Organizacion';
import Logging from '../library/Logging'; // 👉 1. FALTABA ESTA IMPORTACIÓN

const createOrganizacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedOrganizacion = await OrganizacionService.createOrganizacion(req.body);
        return res.status(201).json(savedOrganizacion);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readOrganizacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizacion = await OrganizacionService.getOrganizacion(req.params.organizacionId);
        return organizacion ? res.status(200).json(organizacion) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// Aquí implantamos el http nuevo 
const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizaciones = await OrganizacionService.getAllOrganizaciones();
        return res.status(200).json(organizaciones);
    } catch (error) {
        Logging.error(error); // Ahora Logging sí existe
        return res.status(500).json({ error });
    }
};

const getUsuariosByOrganizacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizacionId = req.params.organizacionId;
        const usuarios = await OrganizacionService.getUsuariosDeOrganizacion(organizacionId);

        if (!usuarios) {
            return res.status(404).json({ message: 'Organización no encontrada' });
        }

        return res.status(200).json({ usuarios });
    } catch (error) {
        Logging.error(error); // Ahora Logging sí existe
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateOrganizacion = async (req: Request, res: Response, next: NextFunction) => {
    const organizacionId = req.params.organizacionId;

    try {
        const organizacion = await OrganizacionService.updateOrganizacion(organizacionId, req.body);
        return organizacion ? res.status(200).json(organizacion) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteOrganizacion = async (req: Request, res: Response, next: NextFunction) => {
    const organizacionId = req.params.organizacionId;

    try {
        const organizacion = await OrganizacionService.deleteOrganizacion(organizacionId);
        return organizacion ? res.status(201).json(organizacion) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// 👉 2. EXPORT CORREGIDO (hemos quitado el readAll duplicado)
export default { createOrganizacion, readOrganizacion, readAll, updateOrganizacion, deleteOrganizacion, getUsuariosByOrganizacion };
