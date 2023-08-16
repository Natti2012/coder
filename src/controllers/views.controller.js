import ProductService from "../services/products.service.js";
import { cartService } from "../services/carts.service.js";

const productService = new ProductService

class ViewsController{

    async productsView(req, res){
        try {
          const user = { firstName: req.session.user?.firstName, lastName: req.session.user?.lastName, email: req.session.user?.email, rol: req.session.user?.rol, cart: req.session.user?.cart}
            const { page } = req.query;
            const query = await productService.getProductData(page);
            const { docs, ...rest } = query;
            let products = docs.map((doc) => {
              return { _id: doc._id, title: doc.title, thumbnail: doc.thumbnail, price: doc.price, stock: doc.stock ,description: doc.description};
            });
            res.status(200).render('products', { products, pagination: rest, user });
          } catch (error) {
            return res.status(500).render('error', {error: error.message})
          }
    }

    async cartView(req, res){
      try {
        const cid = req.params.cid;
        let amount = 0
        const cart = await cartService.getCartById(cid);
        const prodsInCart = cart.products;
        const prods = prodsInCart.map((item) => {
          const { idProduct, quantity } = item;
          const { title, thumbnail, category,price } = idProduct;
          amount+= quantity*price
          return {
           price,
            title,
            thumbnail,
            category,
            quantity,
          };
        });
        res.status(200).render('cart', { cart: cid, products: prods ,amount}) ;
      } catch (error) {
        console.log(error)
        return res.status(500).render('error', {error: error.message})
      }
    }
    homeView(req, res){
      try {
        return res.status(200).render('home', {})
    } catch (error) {
        return res.status(500).render('error',{error: error.message})
    }
    }
}

export const viewsController = new ViewsController