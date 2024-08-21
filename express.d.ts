import { JwtPayload } from 'jsonwebtoken'

export interface JwtPayloadExtended extends JwtPayload {
	userid: number
}

declare global {
	namespace Express {
		interface Request {
			user?: string | JwtPayloadExtended
		}
	}
}
