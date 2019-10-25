const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const url = "mongodb://127.0.0.1:27017";
const dbName = "productExp_db";
    
const productExpController = {
    // all
    get: (req, res) => {
        console.log("Get all");
        const mongoClient = new MongoClient(url);
        mongoClient.connect(function (err, result) {
            if (err) res.status(500).send(err);

            const product = result.db(dbName).collection("product");
            product.find().toArray(function (err, result) {
                if (err)
                    res.status(500).send(err);
                else{
                    res.send(result);
                }

                mongoClient.close();
            });
        });
    },

    //sort by field
    getSorted: (req, res) => {
        const field = req.query["f"] || "name"; //fields: name, coutry, price, quantity

        const rule = req.query["rule"] || 1; //rules: 1(normal), -1(reversed)

    
        console.log("Get all sorted");
        const mongoClient = new MongoClient(url);
        mongoClient.connect(function (err, result) {
            if (err) res.status(500).send(err);

            const product = result.db(dbName).collection("product");
            product.find().toArray(function (err, result) {
                if (err)
                    res.status(500).send(err);
                else{
                    //SORT
                    product.find().sort( { [field]: parseInt(rule) }).toArray( function (err, result2){
                        if (err)
                            res.status(500).send(err);
                        else{res.send(result2)
                            console.log(result2);
                        }
                    });
                    
                }

                mongoClient.close();
            });
        });
    },

    // one
    getId: (req, res) => {
        let id = req.params.id;

        if (id) {
            const mongoClient = new MongoClient(url);
            mongoClient.connect(function (err, result) {
                if (err) res.status(500).send(err);

                const product = result.db(dbName).collection("product");
                product.findOne({_id: mongodb.ObjectID(id)}, function (err, result) {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(result);

                    mongoClient.close();
                });
            });
        } else {
            res.sendStatus(500);
        }
    },
    
    // add
    post: (req, res) => {
        console.log(req.body)
        let newProduct = req.body;

        if (isValid(newProduct)) {
            const mongoClient = new MongoClient(url);
            mongoClient.connect(function (err, result) {
                if (err) res.status(500).send(err);

                const product = result.db(dbName).collection("product");
                product.insertOne(newProduct, function (err, result) {
                    if (err) 
                        res.status(500).send(err);
                    else
                        res.send(newProduct);

                    mongoClient.close();
                });
            });
        } else {
            res.sendStatus(400);
        }
    },
    //get the most expensive
    getExpensive: (req, res) => {
        console.log("Get the the most expensive");
        const mongoClient = new MongoClient(url);
        mongoClient.connect(function (err, result) {
            if (err) res.status(500).send(err);

            const product = result.db(dbName).collection("product");
            product.find().sort( { price: -1 }).toArray( function (err, result){
                if (err)
                    res.status(500).send(err);
                else{
                    
                    res.send(result[0])
                }
            })
        });
    },

    //delete
    deleteId: (req, res) => {
        let id = req.params.id;

        if (id) {
            const mongoClient = new MongoClient(url);
            mongoClient.connect(function (err, result) {
                if (err) res.status(500).send(err);

                const product = result.db(dbName).collection("product");
                product.findOneAndDelete({_id: mongodb.ObjectID(id)}, function (err, result) {
                    if (err) res.status(500).send(err);

                    if (result.value)
                        res.status(200).send(id + " has been deleted.");
                    else
                        res.status(418).send(id + " is not found.");

                    mongoClient.close();                        
                });
            });
        } else {
            res.sendStatus(400);
        }
    }
}

//{name:'', country:'', ptice:123, quantity:456}
const isValid = (product) => {
    return product && product.name && product.country && product.price && product.quantity;
}

module.exports = {
    productExpController
};