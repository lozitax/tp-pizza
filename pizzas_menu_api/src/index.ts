import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoUri);

app.use(express.json());

client.connect().then(() => {
    const db = client.db('pizzas_menu_db');

    app.get('/pizzas', async (req, res) => {
        const pizzas = await db.collection('menu').find({}).toArray();
        res.json(pizzas);
    });

    app.get('/pizzas/:id', async (req, res) => {
        const { id } = req.params;
        const pizza = await db.collection('menu').findOne({ id });
        if (pizza) {
            res.json(pizza);
        } else {
            res.status(404).send('Pizza not found');
        }
    });

    app.get('/pizzas/:id/declinations/:size', async (req, res) => {
        // comme chaque pizza a un id unique, cette route ne sert à rien
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(console.error);
