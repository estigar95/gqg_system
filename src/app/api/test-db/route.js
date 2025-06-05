// src/app/api/test-db/route.js
import { Pool } from 'pg';

export async function GET() {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    return Response.json({ 
      success: true, 
      message: "Conexión exitosa a PostgreSQL",
      time: result.rows[0].now 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: "Error al conectar a PostgreSQL",
      error: error.message 
    }, { status: 500 });
  }
}