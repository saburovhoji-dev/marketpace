const mariadb = require('mariadb');
async function test() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: '127.0.0.1', 
      user: 'root', 
      password: '',
      database: 'digitalhubuz'
    });
    console.log("Connected successfully!");
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    if (conn) conn.end();
  }
}
test();
