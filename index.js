const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()

const port = 3000

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://bill-management-system:WVqEH64rGYBHmUXV@cluster0.gbmzdts.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   await client.connect();
   
     const db = client.db('bill-management-system');
     const billsCollection = db.collection('bills');
     app.get('/bills', async(req,res)=>{
        const result = await billsCollection.find().toArray(); 
        res.send(result);
     })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
