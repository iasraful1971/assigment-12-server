const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const{ MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;





//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhekc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
      await client.connect();
      const database = client.db("sufa-product");
      const productsCollection = database.collection("sofa");
      const usersCollections = database.collection("users");
      const reviewsCollection = database.collection("reviews")
     

      //handle reviews
      app.post('/reviews' , async (req , res) => {
       const review = req.body;
       console.log(review);
       const result = await reviewsCollection.insertOne(review);
       res.json(result);
       console.log(result);
      });

        app.get('/reviews' , async (req ,res) => {
          const cursor = reviewsCollection.find({});
          const reviews = await cursor.toArray();
          res.send(reviews);

        });

      //handle services 
      app.post('/products' , async (req , res) => {
       const product = req.body;
       console.log(product);
       const result = await productsCollection.insertOne(product);
       res.json(result);
       console.log(result);
      });

        app.get('/products' , async (req ,res) => {
          const cursor =productsCollection.find({});
          const services = await cursor.toArray();
          res.send(services);

        })

          //GET SINGLE SERVICE
          app.get('/products/:id' , async(req ,res) => {
            const id = req.params.id;
            console.log('getting sepcifice id' ,id);
            const query = {_id: ObjectId(id)};
            const service =await productsCollection.findOne(query);
            res.json(service);
    });



        //user post
      app.post('/users', async (req ,res) => {
          const user = req.body;
          const result = await usersCollections.insertOne(user);
          res.json(result);
       
      });

      app.get('/users/:email' , async (req ,res) => {
          const email =  req.params.email;
          const query  = {email :email};
          const user = await usersCollections.findOne(query);
        let isAdmin = false;
          if(user?.role === 'admin'){
              isAdmin =true
          }
          res.json({admin : isAdmin})
      });



      app.put('/users' , async (req , res) => {
          const user = req.body;
          const filter = {email : user.email}
          const options = { upsert : true};
          const updateDoc = {$set : user};
          const result = await usersCollections.updateOne(filter , updateDoc , options);
          res.json(result);
          
      });
    //add role
    app.put('/users/admin', async (req , res) => {
        const user = req.body;
        console.log('put' , user);
        const filter ={email : user.email};
        const updateDoc = {$set : { role: 'admin'}};
        const result = await usersCollections.updateOne(filter, updateDoc);
        res.json(result);
        console.log('user is' , result);
    })







    } finally {
      //await client.close();
    }
  }
  run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Assigment 12 is running....')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

