import { TicketMethods } from "../dao/factory.js";
import { ProductService } from "../services/products.service.js"
const productService = new ProductService;
import { cartService } from "../services/carts.service.js";

export class TicketService{


    async createTicket(tk){
    //Esto es lo que vamos a recibir en tk   
    //   tk={ amount, purchaser: user, prodStock,cartId,prodLessStock,  prodOutStock} 
    //Utlizamos el metodo create para crear el nuevo ticket 
        const newTk =await TicketMethods.create(tk);
    
        //Modificamos el stock de aquellos productos que tenian stock 
        const updateStock=  tk.prodStock.map(async(prod,index)=>{
            await productService.updateStockProduct(prod.idProduct, prod.stock)
         })
         //Concatenamos los array que contienen los prod que no tenian stock y que tenian pero no suficiente
          let productInCart= tk.prodLessStock.concat(tk.prodOutStock)
        //Modificamos el cart con el array de productos 
        await cartService.updateProductsCart(tk.cartId,productInCart  )
       
       // REtornamos los productos sin stock asi se le puede notificar al usuario de los productos 
       //que no se pudieron comprar
        return {
            newTk, 
            prodLessStock:tk.prodLessStock,
            prodOutStock:tk.prodOutStock}

        
}
    async getTickets(){
    
        const newTk =await TicketMethods.getAll();
        console.log("newTk", newTk)
        return newTk
        
}
    async deletePurchase(){
    
        const newTk =await TicketMethods.deletePurchase();
        console.log("newTk", newTk)
        return newTk
        
}

}

