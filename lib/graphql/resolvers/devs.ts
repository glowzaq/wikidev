import { Dev } from "@/models/dev.model";
import { devType } from "@/app/shared/type";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const devResolver = {
    Query: {
            devs: async ()=> await Dev.find({}),
            dev: async (_:any, { id }: {id: string})=> await Dev.findById(id),
        },
    Mutation: {
        createDev: async (_:any, {firstName, lastName, email, password}: devType)=> {
            const existingDev = await Dev.findOne({email})
            if (existingDev) {
                throw new Error("Dev with this email already exists")
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const newDev = await Dev.create({
                firstName,
                lastName,
                email,
                password: hashedPassword
            })
            return newDev
        },

        loginDev: async (_:any, {email, password}: {email: string, password: string}) => {
            const dev = await Dev.findOne({email})
            if (!dev) {
                throw new Error('Invalid email or password')
            }
            const isMatch = await bcrypt.compare(password, dev.password)
            if (!isMatch) {
                throw new Error('Invalid email or password')
            }
            const token = jwt.sign(
                { id: dev._id, email: dev.email },
                process.env.JWT_SECRET as string,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );
            return {
                token,
                dev
            }
        }
    }
    }

