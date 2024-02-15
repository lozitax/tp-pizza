import { MongoClient, Db } from 'mongodb';

class OrderService {
    private db: Db;

    constructor(client: MongoClient) {
        this.db = client.db('pizzas_orders_db');
    }

    async getOrders() {
        return this.db.collection('orders').find({}).toArray();
    }

    async getOrdersByPizza(pizzaName: string) {
        return this.db.collection('orders').find({ name: pizzaName }).toArray();
    }

    async getOrdersBySize(size: string) {
        return this.db.collection('orders').find({ size: size }).toArray();
    }

    async getOrdersByFilters(filters: object) {
        return this.db.collection('orders').find(filters).toArray();
    }

    async getOrdersTotalAmount() {
        const result = await this.db.collection('orders').aggregate([
            { $group: { _id: null, totalAmount: { $sum: { $multiply: ["$quantity", "$price"] } } } }
        ]).toArray();
        return result[0] ? result[0].totalAmount : 0;
    }

    async getOrdersTotalQuantity() {
        const result = await this.db.collection('orders').aggregate([
            { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
        ]).toArray();
        return result[0] ? result[0].totalQuantity : 0;
    }

    async getOrdersPizzaQuantity(pizzaName: string) {
        const result = await this.db.collection('orders').aggregate([
            { $match: { name: pizzaName } },
            { $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } } }
        ]).toArray();
        return result[0] ? result[0].totalQuantity : 0;
    }

    async getOrdersSizeQuantity(size: string) {
        const result = await this.db.collection('orders').aggregate([
            { $match: { size: size } },
            { $group: { _id: "$size", totalQuantity: { $sum: "$quantity" } } }
        ]).toArray();
        return result[0] ? result[0].totalQuantity : 0;
    }

    async getMostSoldPizza() {
        const result = await this.db.collection('orders').aggregate([
            {
                $group: {
                    _id: "$name",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 }
        ]).toArray();

        if (result.length > 0) {
            return { name: result[0]._id, quantity: result[0].totalQuantity };
        } else {
            return { name: "No pizza orders found", quantity: 0 };
        }
    }

    async getMostSoldSize() {
        const result = await this.db.collection('orders').aggregate([
            {
                $group: {
                    _id: "$size",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 }
        ]).toArray();

        if (result.length > 0) {
            return { size: result[0]._id, quantity: result[0].totalQuantity };
        } else {
            return { size: "No pizza orders found", quantity: 0 };
        }
    }

    async getMostRevenuePizza() {
        const result = await this.db.collection('orders').aggregate([
            {
                $group: {
                    _id: "$name",
                    totalAmount: { $sum: { $multiply: ["$quantity", "$price"] } }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 1 }
        ]).toArray();

        if (result.length > 0) {
            return { name: result[0]._id, totalAmount: result[0].totalAmount };
        } else {
            return { name: "No pizza orders found", totalAmount: 0 };
        }
    }

}

export default OrderService;