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
        user_id: req.body.user_id,
        status: req.body.status
    }

    try {
        const newOrder = await store.create(order)
        res.json(newOrder)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const update = async (req: Request, res: Response) => {
    const order: Order = {
        id: parseInt(req.params.id),
        user_id: req.body.user_id,
        status: req.body.status
    }

    try {
        const updated = await store.update(order)
        res.json(updated)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id)
    res.json(deleted)
}

const addProduct = async (req: Request, res: Response) => {

    const userId: string = req.params.user_id
    const orderId: string = req.params.order_id
    const productId: string = req.body.product_id
    const quantity: number = req.body.quantity

    try {
        const order = await store.addProduct(quantity, userId, orderId, productId)
        res.json(order)
    } catch (err) {
        res.status(400)
        res.json(err)
    }

}

const order_routes = (app: express.Application) => {
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.get('/orders/active/:user_id', currentOrderByUser)
    app.get('/orders/complete/:user_id', completedOrdersByUser)
    app.post('/orders', create)
    app.delete('/orders/:id', destroy)
    app.post('/users/:user_id/orders/:order_id/products', addProduct)
    app.put('/orders/:id', update)
}

export default order_routes