const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
     const paymentsCollection = db.collection('paymentsCollection')

     app.get('/bills', async(req,res)=>{
        const result = await billsCollection.find().toArray(); 
        res.send(result);
     })
     app.get('/latest-bills', async (req,res)=>{
          const result = await billsCollection.find().sort({date: -1}).limit(6).toArray();
           res.send(result);
     })
     app.get('/bill-details/:id', async(req,res)=>{
      const {id} = req.params;
      const result = await billsCollection.findOne({_id : new ObjectId(id)} );
      res.send(result);
     })
     app.get('/myPayBills', async(req,res)=>{
      const email = req.query.email;
      const query = {};
      if(email){
        query.email = email;
      }
      const cursor = paymentsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
     })
   

     app.post('/payments-history', async (req, res) => {
    
        const payment = req.body;
        const result = await paymentsCollection.insertOne(payment);
        res.send(result);
      
     });

    app.put('/bills/:id', async(req,res)=>{
      const {id} = req.params;
      const newUpdatedData = req.body;
      // console.log(newUpdatedData);
      
      const filter = {_id: new ObjectId(id)};
      const update = {
        $set : newUpdatedData
      }

      const result = await paymentsCollection.updateOne(filter,update)
      res.send(result);

     })
     app.delete('/bills/:id', async(req,res)=>{
      const {id} = req.params;
       const filter = {_id: new ObjectId(id)};

       const result = await paymentsCollection.deleteOne(filter);
       res.send(filter);


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