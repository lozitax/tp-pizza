"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let data = fs.readFileSync('menu.json');
let pizzas = JSON.parse(data);
pizzas = pizzas.map(pizza => (Object.assign(Object.assign({}, pizza), { id: uuidv4() })));
fs.writeFileSync('menu_updated.json', JSON.stringify(pizzas, null, 2));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new mongodb_1.MongoClient(mongoUri);
app.use(express_1.default.json());
client.connect().then(() => {
    const db = client.db('pizzas_menu_db');
    app.get('/pizzas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pizzas = yield db.collection('menu').find({}).toArray();
        res.json(pizzas);
    }));
    app.get('/pizzas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const pizza = yield db.collection('menu').findOne({ id });
        if (pizza) {
            res.json(pizza);
        }
        else {
            res.status(404).send('Pizza not found');
        }
    }));
    app.get('/pizzas/:id/declinations/:size', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, size } = req.params;
        const pizza = yield db.collection('menu').findOne({ id, 'declinations.size': size }, { projection: { 'declinations.$': 1 } });
        if (pizza) {
            res.json(pizza);
        }
        else {
            res.status(404).send('Pizza or size not found');
        }
    }));
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(console.error);
