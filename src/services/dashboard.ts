import Client from '../database'

export class DashboardQueries {
  // Get top 5 most popular products (popular = appearing in most orders, not quantity sold)
  async top5Products(): Promise<{name: string, price: number}[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT products.name, products.price, COUNT(order_products.product_id) AS order_count FROM products INNER JOIN order_products ON products.id = order_products.product_id GROUP BY products.name, products.price ORDER BY order_count DESC LIMIT 5'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`)
    }
  }
}