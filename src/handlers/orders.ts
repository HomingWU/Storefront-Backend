import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import { verifyAuthToken, verifyUser, verifyUserInBody } from '../middleware/authMiddleware'

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
        const error = err as Error
        res.status(400)
        res.json(error.message)
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
        const error = err as Error
        res.status(400)
        res.json(error.message)
    }
}

const destroy = async (req: Request, res: Response) => {
    if (req.body.id !== parseInt(req.params.id)) {
        console.log(req.body.id, req.params.id, typeof(req.body.id), typeof(req.params.id))
        res.status(400)
        res.json('Order ID in path does not match body')
        return
    }
    const order: Order = {
        id: parseInt(req.params.id),
        user_id: req.body.user_id,
        status: req.body.status
    }
    const deleted = await store.delete(order)
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
        const error = err as Error
        res.status(400)
        res.json(error.message)
    }

}

const order_routes = (app: express.Application) => {
    app.get('/orders', verifyAuthToken, index)
    app.get('/orders/:id', verifyAuthToken, show)
    app.get('/orders/active/:user_id', verifyUser, currentOrderByUser)
    app.get('/orders/complete/:user_id', verifyUser, completedOrdersByUser)
    app.post('/orders', verifyUserInBody, create)
    app.delete('/orders/:id', verifyUserInBody, destroy)
    app.post('/users/:user_id/orders/:order_id/products', verifyUser, addProduct)
    app.put('/orders/:id', verifyUserInBody, update)
}

export default order_routes