import express from 'express';
import { cartController } from '../controllers/carts.controller.js';
import { isUser } from '../middlewares/authenticator.js'


const cartsRouter = express.Router();

cartsRouter.get("/", cartController.getAll);
cartsRouter.post("/", cartController.newCart);
cartsRouter.get("/:id", cartController.getCartById);
cartsRouter.post("/:cid/product/:pid", cartController.addPorductToCart)
cartsRouter.delete("/:id", cartController.delete)
cartsRouter.delete("/:cid/product/:pid", cartController.deleteProductFromCart)
cartsRouter.put("/:cid/product/:pid", cartController.updateQuantity)
cartsRouter.put("/:cid", cartController.updateCart)
cartsRouter.get('/:cid/purchase', cartController.purchase)
cartsRouter.get('/:cid/purchases', cartController.getPurchase)
cartsRouter.delete('/:cid/purchases', cartController.deletePurchase)

export default cartsRouter;