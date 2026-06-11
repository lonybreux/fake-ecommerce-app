import dotenv from 'dotenv'
dotenv.config()

if(!process.env.CLIENT_URL) throw new Error('CLIENT_URL no definido')

export const PORT = process.env.PORT || 3000
export const CLIENT_URL = process.env.CLIENT_URL

