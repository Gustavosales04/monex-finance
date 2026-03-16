import sql from 'mssql'

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log('Conectado ao SQL Server com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar no SQL Server:', error);
  }
}

export { sql, connectDB }