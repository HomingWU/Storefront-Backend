import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import user_routes from './handlers/users'
import product_routes from './handlers/products'
import order_routes from './handlers/orders'
import dashboard_routes from './handlers/dashbords'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

//not necessary for this project, just an example of how to use cors
const corsOptions: cors.CorsOptions = {
    origin: 'http://frontend.example.com',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

dashboard_routes(app)
user_routes(app)
product_routes(app)
order_routes(app)


app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
