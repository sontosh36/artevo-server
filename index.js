require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l1sfp1m.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("artevo_DB");
    const artCollection = database.collection("artworks");

    // insert Artworks postAPI
    app.post("/artworks", async (req, res) => {
      const newArtwork = req.body;
      const result = await artCollection.insertOne(newArtwork);
      res.send(result);
    });
    // explore artworks API
    app.get("/artworks", async (req, res) => {
      const cursor = artCollection
        .find({ visibility: "public" })
        .sort({ title: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    // featured artwork get API
    app.get("/featured-artworks", async (req, res) => {
      const cursor = artCollection
        .find({ visibility: "public" })
        .sort({ create_at: -1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    // artwork details API
    app.get("/artwork/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.findOne(query);
      res.send(result);
    });
    // my gallery api
    app.get("/my-artworks", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.artistEmail = email;
      }
      const cursor = artCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // artwork delete api
    app.delete('/artwork/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await artCollection.deleteOne(query);
      res.send(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log(
      `pinged your deployment. You Successfully connected to mongoDB!`,
    );
  } finally {
    // await client.close();
    // Because finally closes the connection, but the server still needs it.
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`server content is comming`);
});

app.listen(port, () => {
  console.log(`server start on port ${port}`);
});
