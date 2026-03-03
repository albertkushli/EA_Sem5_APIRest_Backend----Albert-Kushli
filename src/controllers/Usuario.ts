import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Usuario, { IUsuarioModel } from '../models/Usuario';

const createUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const { organizacion, name, email, password } = req.body;

    const usuario: IUsuarioModel = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        organizacion,
        name,
        email,
        password
    });

    try {
        const savedUsuario: IUsuarioModel = await usuario.save();
        return res.status(201).json(savedUsuario);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    try {
        const usuario: IUsuarioModel | null = await Usuario.findById(usuarioId).populate('organizacion');
        return usuario ? res.status(200).json(usuario) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarios: IUsuarioModel[] = await Usuario.find();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    try {
        const usuario: IUsuarioModel | null = await Usuario.findById(usuarioId);
        if (usuario) {
            usuario.set(req.body);
            const savedUsuario: IUsuarioModel = await usuario.save();
            return res.status(201).json(savedUsuario);
        } else {
            return res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    try {
        const usuario: IUsuarioModel | null = await Usuario.findByIdAndDelete(usuarioId);
        return usuario ? res.status(201).json(usuario) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createUsuario, readUsuario, readAll, updateUsuario, deleteUsuario };
