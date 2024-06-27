import express, { Request, Response } from 'express'
import { DashboardQueries } from '../services/dashboard'

const dashboard = new DashboardQueries()

const top5Products = async (_req: Request, res: Response) => {
    const products = await dashboard.top5Products()
    res.json(products)
}

const dashboard_routes = (app: express.Application) => {
    app.get('/dashboard/top5products', top5Products)
}

export default dashboard_routes
