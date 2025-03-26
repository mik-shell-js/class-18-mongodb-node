import 'dotenv/config';
import express from 'express';
import cors from 'cors';
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

// log every request to the console
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// --- Change nothing above this line ---


// Connect to MongoDB
import { MongoClient, ObjectId } from 'mongodb'; // import MongoDB Client
const client = new MongoClient('mongodb://localhost:27017'); // connect to the host
const connection = await client.connect(); // store the connection
const db = connection.db("app")

app.get('/api/produce.json', async (req, res) => {
  const produce = await db.collection('produce').find().toArray()
  res.json(produce).status(200);
});

// route for Banana document
// app.get('/api/produce/67e40f14c19ec4a1c06b140c.json', async (req, res) => {
//   const Banana = await db.collection('produce').findOne({
//     _id: new ObjectId("67e40f14c19ec4a1c06b140c")
//   })
//   res.json(Banana).status(200);
// });

// route for any singe document using Express Params
app.get('/api/produce/:id.json', async (req, res) => {
  const id = req.params.id
  const Banana = await db.collection('produce').findOne({
    _id: new ObjectId(id)
  })
  res.json(Banana).status(200);
});


// --- Change nothing below this line ---

// 404 - not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'resource ' + req.url + ' not found' });
});

// 500 - Any server error
app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});

// start server on port
app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}/`);
});
