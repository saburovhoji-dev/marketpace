const mariadb = require('mariadb');
async function test() {
  const pool = mariadb.createPool({
    host: '127.0.0.1', 
    user: 'root', 
    password: '',
    database: 'digitalhubuz'
  });
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Pool connection successful!");
  } catch (err) {
    console.error("Pool connection failed:", err);
  } finally {
    if (conn) conn.end();
    await pool.end();
  }
}
test();
