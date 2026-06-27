import type { JwtPayload } from "jsonwebtoken";


declare global {
    namespace Express {
        interface Request {
            user?: {_id: string, rol: 'cliente' | 'admin' } & JwtPayload
        }
    }
}