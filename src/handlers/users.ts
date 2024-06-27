import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'

const store = new UserStore()

const index = async (_req: Request, res: Response) => {
    const users = await store.index()
    res.json(users)
}

const show = async (req: Request, res: Response) => {
    const user = await store.show(req.params.id)
    res.json(user)
}

const create = async (req: Request, res: Response) => {
    const user: User = {
        id: 0,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    }

    const newUser = await store.create(user)
    res.json(newUser)
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id)
    res.json(deleted)
}

const user_routes = (app: express.Application) => {
    app.get('/users', index)
    app.get('/users/:id', show)
    app.post('/users', create)
    app.delete('/users/:id', destroy)
}

export default user_routes