const express = require("express");
const cors = require("cors");
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.aye3q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("userDB");

    const userCol = database.collection("users");

    app.get("/users", async (req, res) => {
      await client.connect();
      const cursor = userCol.find();
      const results = await cursor.toArray();
      res.send(results);
    });
    app.get("/users/:id", async (req, res) => {
      await client.connect();
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await userCol.findOne(query);
      res.send(user);
    });

    app.post("/users", async (req, res) => {
      try {
        await client.connect();
        const user = req.body;
        const result = await userCol.insertOne(user);
        console.log("new user", user);
        res.send(result);
      } finally {
        await client.close();
      }
    });

    app.put("/users/:id", async (req, res) => {
      await client.connect();
      const id = req.params.id;
      const user = req.body;
      console.log(user);
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await userCol.updateOne(filter, updatedUser, options);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      try {
        await client.connect();
        const id = req.params.id;
        console.log(`plz delete`, id);
        const query = { _id: new ObjectId(id) };
        const result = await userCol.deleteOne(query);
        res.send(result);
      } finally {
        await client.close();
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    console.log('all this will eventually end');
  }
}
run().catch(console.dir);

const port = process.env.PORT || 5120;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("simple crud stuff");
});

app.listen(port, () => {
  console.log(`simple funny business @ localhost:${port}`);
});
