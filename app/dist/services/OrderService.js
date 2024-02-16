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
const fs_1 = __importDefault(require("fs"));
class OrderService {
    constructor(client) {
        this.db = client.db('pizzas_orders_db');
    }
    getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.collection('orders').find({}).toArray();
        });
    }
    getOrdersByPizza(pizzaName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.collection('orders').find({ name: pizzaName }).toArray();
        });
    }
    getOrdersBySize(size) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.collection('orders').find({ size: size }).toArray();
        });
    }
    getOrdersByFilters(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.collection('orders').find(filters).toArray();
        });
    }
    getOrdersTotalAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
                { $group: { _id: null, totalAmount: { $sum: { $multiply: ["$quantity", "$price"] } } } }
            ]).toArray();
            return result[0] ? result[0].totalAmount : 0;
        });
    }
    getOrdersTotalQuantity() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
                { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
            ]).toArray();
            return result[0] ? result[0].totalQuantity : 0;
        });
    }
    getOrdersPizzaQuantity(pizzaName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
                { $match: { name: pizzaName } },
                { $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } } }
            ]).toArray();
            return result[0] ? result[0].totalQuantity : 0;
        });
    }
    getOrdersSizeQuantity(size) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
                { $match: { size: size } },
                { $group: { _id: "$size", totalQuantity: { $sum: "$quantity" } } }
            ]).toArray();
            return result[0] ? result[0].totalQuantity : 0;
        });
    }
    getMostSoldPizza() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
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
            }
            else {
                return { name: "No pizza orders found", quantity: 0 };
            }
        });
    }
    getMostSoldSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
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
            }
            else {
                return { size: "No pizza orders found", quantity: 0 };
            }
        });
    }
    getMostRevenuePizza() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
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
            }
            else {
                return { name: "No pizza orders found", totalAmount: 0 };
            }
        });
    }
    getQuantityByMediumSize() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.collection('orders').aggregate([
                { $match: { size: "medium" } },
                { $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } } }
            ]).toArray();
        });
    }
    getAverageQuantityOrdered() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('orders').aggregate([
                { $group: { _id: null, totalQuantity: { $sum: "$quantity" }, count: { $sum: 1 } } },
                { $project: { _id: 0, averageQuantity: { $divide: ["$totalQuantity", "$count"] } } }
            ]).toArray();
            return result.length > 0 ? result[0].averageQuantity : 0;
        });
    }
    getMenuDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $group: {
                        _id: { name: "$name", size: "$size" },
                        price: { $first: "$price" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id.name",
                        size: "$_id.size",
                        price: 1,
                    },
                },
                {
                    $sort: { name: 1, size: 1 },
                },
            ];
            const menuDetails = yield this.db.collection('orders').aggregate(pipeline).toArray();
            return menuDetails;
        });
    }
    exportMenuToJson() {
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield this.getMenuDetails();
            fs_1.default.writeFileSync('menu.json', JSON.stringify(menu, null, 2), 'utf8');
            console.log('Menu details exported to menu.json');
        });
    }
}
exports.default = OrderService;
