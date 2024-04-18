const fastify = require('fastify')({
  logger: true
})

const { queryResult } = require('pg-promise');
const db = require('./db');

//Tugas
//Menampilkan list buku berdasarkan pencarian dari methode query string
fastify.get('/get/buku', async (request, reply) => {
  const buku = await db.query("select id, sku, judul from buku where judul like $1", [`%${request.query.cariJudul}%`]);
  return buku;
})

//menampilkan detail buku dengan methode params
fastify.get('/get/sku/:cariSku', async (request, reply) => {
    const buku = await db.query("select * from buku where sku like $1", [`%${request.params.cariSku}%`]);
    return buku;
  })

//insert data buku baru menggunakan payload
fastify.post('/post/idBuku', async (request, reply) => {
  const buku = await db.query(
    "insert into buku (sku, judul, harga, stok) values ($1, $2, $3, $4) RETURNING *", 
    [request.body.sku, request.body.judul, request.body.harga, request.body.stok]);
  return buku;
})

//update buku menggunakan params dan payload
fastify.put('/put/update/:idBuku', async (request, reply) => {
    //const idBuku = request.params.id
    const buku = await db.query("update buku set sku = $1, judul =$2, harga =$3, stok= $4 where id = $5",
  [request.body.sku, request.body.judul, request.body.harga, request.body.stok, request.params.idBuku])
    return buku
  })

//tidak menerima methode payload
//delete buku menggunakan params 
fastify.delete('/delete/:idBuku', async (request, reply) => {
    const buku = await db.query("delete from buku where id = $1", [request.params.idBuku])
    return buku;
  })

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()