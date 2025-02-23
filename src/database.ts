import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const{
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  ENV
} = process.env


const client: Pool = new Pool({
  host: POSTGRES_HOST,
  database: ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: parseInt(POSTGRES_PORT as string),
})
console.log(ENV)

export default client