import mongoose, { Model, Schema } from "mongoose";

export interface IDev extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
}

const devSchema = new Schema<IDev>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export const Dev: Model<IDev> = mongoose.models.Dev || mongoose.model<IDev>("Dev", devSchema)
