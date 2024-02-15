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
const mongodb_1 = require("mongodb");
const OrderService_1 = __importDefault(require("./services/OrderService"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = process.env.MONGO_URI || '';
const client = new mongodb_1.MongoClient(url);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        console.log('Connected successfully to MongoDB');
        const orderService = new OrderService_1.default(client);
        // Exemple d'utilisation de OrderService
        const allOrders = yield orderService.getOrders();
        console.log('All Orders:', allOrders);
        const ordersByPizza = yield orderService.getOrdersByPizza('Margherita');
        console.log('Orders for Margherita:', ordersByPizza);
        const ordersBySize = yield orderService.getOrdersBySize('Large');
        console.log('Large size orders:', ordersBySize);
        // get Quel est le montant total des commandes de pizzas (tous formats confondus)
        const ordersTotalAmount = yield orderService.getOrdersTotalAmount();
        console.log('Total amount of orders:', ordersTotalAmount);
        // Fermer la connexion quand c'est fini
        yield client.close();
    });
}
main();
