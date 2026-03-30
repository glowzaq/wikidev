import { Dev } from "@/models/dev.model";
import { devType } from "@/app/shared/type";

export const devResolver = {
    Query: {
            devs: async ()=> await Dev.find({}),
            dev: async (_:any, { id }: {id: string})=> await Dev.findById(id),
        },
    Mutation: {
        createDev: async (_:any, {firstName, lastName, email, password}: devType)=> {
            const newDev = await Dev.create({
                firstName,
                lastName,
                email,
                password
            })
            return newDev
        }
    }
    }

