import mongoose, { Document, Schema } from 'mongoose';

// 1. Añadimos el array de ObjectIds en la interfaz
export interface IOrganizacion {
    name: string;
    usuarios: mongoose.Types.ObjectId[]; // Vector de IDs apuntando a Usuario
}

export interface IOrganizacionModel extends IOrganizacion, Document {}

// 2. Modificamos el Schema para incluir la referencia
const OrganizacionSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        // Referencia manual a la colección 'Usuario'
        usuarios: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }] 
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IOrganizacionModel>('Organizacion', OrganizacionSchema);