import { CartMethods } from "../dao/factory.js"
import { ProductService } from "../services/products.service.js"
import { TicketService } from "./tickets.service.js";
import { UserService } from "./users.service.js";

const productService = new ProductService;
const ticketService = new TicketService
const userSevice = new UserService
class CartService {

  async getAll() {
    try {
      const carts = await CartMethods.find();
      return carts;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addCart() {
    try {
      let newCart = await CartMethods.create({ products: [] })
      console.log('Cart was created succesfully');
      return newCart;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getCartById(_id) {
    try {
      const cart = await CartMethods.findPopulatedOne(_id);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteCart(_id) {
    try {

      await CartMethods.updateOne(_id);
      // const cart = await this.getCartById(_id)
      // return cart;   
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addProductToCart(productId, cartId) {
    try {
      let carts = await this.getAll();
      let checkCId = carts.find((cId) => cId._id.equals(cartId));
      if (!checkCId) {
        throw new Error("Invalid id, cart not found");
      }
      let cart = await CartMethods.findOne(cartId);
      console.log(cart)
      let existingProduct = cart.products.find((pId) => pId.idProduct.equals(productId));

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ idProduct: productId, quantity: 1 });
      }

      await cart.save();

      console.log(`Product ${productId} was added successfully to cart ${cartId}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProductFromCart(productId, cartId) {
    try {
      let carts = await this.getAll();
      let checkCId = carts.find((cId) => cId._id.equals(cartId));
      if (!checkCId) {
        throw new Error("Invalid id, cart not found");
      }
      let cart = await CartMethods.findOne(cartId)

      let existingProduct = cart.products.find((pId) => pId.idProduct.equals(productId));
      if (existingProduct) {
        if (existingProduct.quantity === 1) {
          cart.products.splice(cart.products.indexOf(existingProduct), 1);
        } else {
          existingProduct.quantity -= 1;
        }
      } else {
        throw new Error(`Product with id: ${productId} was not found in the cart with id:${cartId}`);
      }
      await cart.save();
      console.log(`Product ${productId} was deleted successfully from cart ${cartId}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCart(cartId, productId, cartByUser) {
    try {
      if (productId === null) {
        //modifica carrito nuevo
        let cart = await CartMethods.findOne(cartId)
        let newCart = cart.products = cartByUser.products
        await cart.save();
        console.log(`The products of cart with id:${cartId} was updated succesfuly`)
        return newCart;
      } else {
        //modifica cantidad
        let cart = await CartMethods.findOne(cartId)

        let existingProduct = cart.products.find((pId) => pId.idProduct.equals(productId));
        if (existingProduct) {
          existingProduct.quantity = cartByUser.quantity
        } else {
          throw new Error(`Product with id: ${productId} was not found in the cart with id:${cartId}`);
        }
        await cart.save();
        return cart;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateProductsCart(cartId, arrayproductId) {
    try {

      let cart = await CartMethods.updateProducts(cartId, arrayproductId)


      console.log(`The products of cart with id:${cartId} was updated succesfuly`)
      return cart;

    } catch (error) {
      console.log("---------------------------------", error)
      throw new Error(error.message);
    }
  }

  async purchase(cartId, user) {
    try {

      let cart = await CartMethods.findOne(cartId)
      if (cart) {
        // consigue id de productos en cart
        const productIds = cart.products.map(product => product.idProduct.toString());
        // consigue quantity de productos en cart
        const productsQuantity = cart.products.map(quan => quan.quantity)
        // consigue datos de los productos en cart
        const productsData = await productService.getArrProductsData(productIds)

        let amount = 0;
        let prodOutStock = []
        let prodStock = []
        // let prodLessStock = []

        productsData.map((prod, index) => {
          //Si No hay stock del producto
          if (productsQuantity[index] > prod.stock) {
            //Lo pusheamos al array para luego modificar el cart
            prodOutStock.push({
              idProduct: prod._id,
              quantity: productsQuantity[index]
            });
          }

          else { //Si hay stock del product
            //este va a ser el nuevo stock del producto 
            let newStock = prod.stock - (productsQuantity[index])

            //Multiplicamos el precio por la cantidad y lo sumamos al total
            let priceProduct = prod.price * (productsQuantity[index])
            amount += priceProduct
            //pusheamos al array para luego modificar el stock del producto con el nuevo stock
            prodStock.push({
              idProduct: prod._id,
              stock: newStock
            });

          }
        })

        //Usamos .createTicket y  Creamos el ticket

        const ticket = await ticketService.createTicket({
          amount,
          purchaser: user,//Este es el email del user que lo sacamos de req.session
          // cartId
        })

        return {
          ticket,
          prodStock,
          prodOutStock
        }

      } else {
        throw new Error('That cart doesnt exist');
      }


    } catch (error) {
      throw new Error(error.message);
    }

  }
  async getPurchase() {
    try {
      const tickets = await ticketService.getTickets();
      return tickets;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletePurchase() {
    try {
      const tickets = await ticketService.deletePurchase();
      return tickets;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export const cartService = new CartService
  //Si hay stock del producto pero La cantidad es mayor
          // else if (productsQuantity[index] > prod.stock) {
          //   //Lo pusheamos al array para luego modificar el stock del producto en 0
          //   prodStock.push({
          //     idProduct: prod._id,
          //     stock: 0
          //   });
          //   //Sumamos al total el precio multiplicado por el stock ya que es la cantidad de productos que se van a poder agregar
          //   let priceProduct = prod.price * prod.stock
          //   amount += priceProduct
          //   //Sumamos el producto al array para luego modificar el carrito con la cantidad de stock que no se pudo vender
          //   let outStock = (productsQuantity[index]) - prod.stock

          //   prodLessStock.push({
          //     idProduct: prod._id,
          //     quantity: outStock
          //   })

          // } 