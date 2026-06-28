import type { Request, Response, NextFunction } from "express";

const verificarAdmin = (req: Request, res:Response, next: NextFunction ): void => {

    if(req.user?.rol !== 'admin') {
        res.status(403).json({
            message: 'se requiere rol de admin'
        })
        return
    }

    next()

}

export default verificarAdmin