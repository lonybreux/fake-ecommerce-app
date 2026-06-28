import type { JwtPayload } from "jsonwebtoken";


declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & {_id: string, rol: 'cliente' | 'admin' }
        }
    }
}