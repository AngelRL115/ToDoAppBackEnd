import { JwtPayload } from 'jsonwebtoken'

export interface JwtPayloadExtended extends JwtPayload {
	userId: number
}

declare global {
	namespace Express {
		interface Request {
			user?: string | JwtPayloadExtended
		}
	}
}
