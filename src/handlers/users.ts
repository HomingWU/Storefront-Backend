import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import { verifyAuthToken, verifyUser } from '../middleware/authMiddleware'
import jwt from 'jsonwebtoken'

const store = new UserStore()
const secret = process.env.TOKEN_SECRET as string

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
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, secret);
    res.json({token, user: newUser});
  } catch (err) {
    const error = err as Error
    res.status(400)
    res.json(error.message)
  }
};

const authenticate = async (req: Request, res: Response) => {
    const user = await store.authenticate(req.body.firstname, req.body.lastname, req.body.password)
    if (user) {
        const token = jwt.sign({ user: user }, secret);
        res.json({token, user: user})
    } else {
        res.status(401)
        res.json({ error: 'unauthorized' })
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id)
    res.json(deleted)
}

const update = async (req: Request, res: Response) => {
    const user: User = {
        id: parseInt(req.params.id),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    }

    const updated = await store.update(user)
    res.json(updated)
}

const user_routes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, index)
    app.get('/users/:id', verifyAuthToken, show)
    app.post('/users', create)
    app.delete('/users/:id', verifyUser, destroy)
    app.put('/users/:id', verifyUser, update)
    app.post('/users/authenticate', authenticate)
}

export default user_routes