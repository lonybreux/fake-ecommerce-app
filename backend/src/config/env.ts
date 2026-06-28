import dotenv from 'dotenv'
dotenv.config()

if(!process.env.CLIENT_URL) throw new Error('CLIENT_URL no definido')
if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI no definido')
if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET no definido')

export const PORT = process.env.PORT || 3000
export const CLIENT_URL = process.env.CLIENT_URL
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET

