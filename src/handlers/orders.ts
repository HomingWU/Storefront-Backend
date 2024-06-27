import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
    const orders = await store.index()
    res.json(orders)
}

const show = async (req: Request, res: Response) => {
    const order = await store.show(req.params.id)
    res.json(order)
}

const currentOrderByUser = async (req: Request, res: Response) => {
    const orders = await store.currentOrderByUser(req.params.user_id)
    res.json(orders)
}

const completedOrdersByUser = async (req: Request, res: Response) => {
    const orders = await store.completedOrdersByUser(req.params.user_id)
    res.json(orders)
}

const create = async (req: Request, res: Response) => {
    const order: Order = {
        id: 0,
        user_id: 1,
        status: 'active'
    }

    try {
        const newOrder = await store.create(order)
        res.json(newOrder)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const order_routes = (app: express.Application) => {
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.get('/orders/users/:user_id/current', currentOrderByUser)
    app.get('/orders/users/:user_id/completed', completedOrdersByUser)
}

export default order_routes