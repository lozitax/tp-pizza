import { MongoClient } from 'mongodb';
import OrderService from './services/OrderService';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URI || '';
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const orderService = new OrderService(client);

        // Exemple d'utilisation de OrderService
        const allOrders = await orderService.getOrders();
        console.log('All Orders:', allOrders);

        console.log("Étape 3 :")

        const ordersTotalAmount = await orderService.getOrdersTotalAmount();
        console.log('Quel est le montant total des commandes de pizzas (tous formats confondus) ?', ordersTotalAmount);

        const ordersTotalQuantity = await orderService.getOrdersTotalQuantity();
        console.log('Combien de pizzas ont été commandées (toutes recettes et formats confondus) ?', ordersTotalQuantity);

        const ordersPizzaQuantity = await orderService.getOrdersPizzaQuantity('Vegan');
        console.log('Combien de pizzas "Vegan" ont été commandées ?', ordersPizzaQuantity);
        
        const ordersSizeQuantity = await orderService.getOrdersSizeQuantity('large');
        console.log('Combien de pizzas ont été commandées en format "large" ?', ordersSizeQuantity);

        const mostSoldPizza = await orderService.getMostSoldPizza();
        console.log('Quelle recette de pizza a été la plus vendue ?', mostSoldPizza);

        const getMostSoldSize = await orderService.getMostSoldSize();
        console.log('Quel format de pizza a été le plus vendu ?', getMostSoldSize);

        const getMostRevenuePizza = await orderService.getMostRevenuePizza();
        console.log('Quelle recette de pizza a généré le plus de revenus ?', getMostRevenuePizza);

        console.log("Étape 4 :");

        const getQuantityByMediumSize = await orderService.getQuantityByMediumSize();
        console.log('Calcul de la quantité de pizzas commandées par format "medium" pour chaque recette de pizza', getQuantityByMediumSize);

        await orderService.exportMenuToJson();

        // Fermer la connexion quand c'est fini
        await client.close();
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        await client.close();
    }
}

main().catch(console.error);
