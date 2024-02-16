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
        try {
            yield client.connect();
            console.log('Connected successfully to MongoDB');
            const orderService = new OrderService_1.default(client);
            // Exemple d'utilisation de OrderService
            const allOrders = yield orderService.getOrders();
            console.log('All Orders:', allOrders);
            console.log("Étape 3 :");
            const ordersTotalAmount = yield orderService.getOrdersTotalAmount();
            console.log('Quel est le montant total des commandes de pizzas (tous formats confondus) ?', ordersTotalAmount);
            const ordersTotalQuantity = yield orderService.getOrdersTotalQuantity();
            console.log('Combien de pizzas ont été commandées (toutes recettes et formats confondus) ?', ordersTotalQuantity);
            const ordersPizzaQuantity = yield orderService.getOrdersPizzaQuantity('Vegan');
            console.log('Combien de pizzas "Vegan" ont été commandées ?', ordersPizzaQuantity);
            const ordersSizeQuantity = yield orderService.getOrdersSizeQuantity('large');
            console.log('Combien de pizzas ont été commandées en format "large" ?', ordersSizeQuantity);
            const mostSoldPizza = yield orderService.getMostSoldPizza();
            console.log('Quelle recette de pizza a été la plus vendue ?', mostSoldPizza);
            const getMostSoldSize = yield orderService.getMostSoldSize();
            console.log('Quel format de pizza a été le plus vendu ?', getMostSoldSize);
            const getMostRevenuePizza = yield orderService.getMostRevenuePizza();
            console.log('Quelle recette de pizza a généré le plus de revenus ?', getMostRevenuePizza);
            console.log("Étape 4 :");
            const getQuantityByMediumSize = yield orderService.getQuantityByMediumSize();
            console.log('Calcul de la quantité de pizzas commandées par format "medium" pour chaque recette de pizza', getQuantityByMediumSize);
            yield orderService.exportMenuToJson();
            // Fermer la connexion quand c'est fini
            yield client.close();
        }
        catch (err) {
            console.error('Failed to connect to MongoDB', err);
            yield client.close();
        }
    });
}
main().catch(console.error);
