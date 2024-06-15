const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.81vd20h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("StyleSavvy");
    const usersDB = database.collection("usersCollection");

    app.post("/users", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await usersDB.insertOne(data);
      console.log(result);
      res.send(result);
    });

    app.get("/login", async (req, res) => {
      const { email, password } = req.query;
      const user = await usersDB.findOne({ email, password });
      if (user) {
        res.send(user);
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    });

    app.get("/users", async (req, res) => {
      const users = await usersDB.find().toArray();
      res.send(users);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
