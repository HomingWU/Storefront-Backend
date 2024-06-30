import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET as string;

export const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        const decoded: any = jwt.verify(token, secret)
        const userId = parseInt(req.params.user_id)
        if(decoded.user.id !== userId){
            res.status(401)
            res.json('Access denied, invalid token')
            return
        }
        next()
    } catch (error) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
}

export const verifyUserInBody = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        const decoded: any = jwt.verify(token, secret)
        const userId = parseInt(req.body.user_id)
        if(decoded.user.id !== userId){
            res.status(401)
            res.json('Access denied, invalid token')
            return
        }
        next()
    } catch (error) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
}