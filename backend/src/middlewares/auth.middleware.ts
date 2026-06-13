import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "../config/env.js";


const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
    
    const token = req.headers['authorization']?.replace('Bearer ', '')

    if(!token) {
        res.status(401).json({
            message: 'token requerido'
        })
        return
    }

    try {
        const decoded = jwt.verify(token,JWT_SECRET) as {_id: string} & JwtPayload
        req.user = decoded
        console.log(decoded)
        next()
    } catch(error) {
        res.status(403).json({
            message: error instanceof Error ? error.message : 'token invalido'
        })
    }
}

export default verificarToken