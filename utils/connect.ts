import mongoose from "mongoose"

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        console.log(`Mongoose connected successfully: ${conn}`)
    } catch (error) {
        console.error('Error connecting to mongoDB')
        process.exit(1)
    }
}