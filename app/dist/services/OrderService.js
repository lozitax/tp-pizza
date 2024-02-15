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
Object.defineProperty(exports, "__esModule", { value: true });
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
            return this.db.collection('orders').find({ pizza: pizzaName }).toArray();
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
            const orders = yield this.db.collection('orders').find({}).toArray();
            return orders.reduce((acc, order) => acc + order.amount, 0);
        });
    }
}
exports.default = OrderService;
