import { TicketMethods } from "../dao/factory.js";
import { ProductService } from "../services/products.service.js"
const productService = new ProductService;
import { cartService } from "../services/carts.service.js";

export class TicketService {


    async createTicket(tk) {
        const newTk = await TicketMethods.create(tk);
        return newTk
    }

    // //Modificamos el stock de aquellos productos que tenian stock 
    async updateStock(prodStock) {
        prodStock.map(async (prod, index) => {
            await productService.updateStockProduct(prod.idProduct, prod.stock)
            console.log("se modifico stock de los product",prodStock);
    
        })
    }

    async getTickets() {
        const newTk = await TicketMethods.getAll();
        return newTk

    }
    async deletePurchase() {
        const newTk = await TicketMethods.deletePurchase();
        return newTk

    }

}


