import { Router } from "express";
import { productManager } from "../managers/index.js";

const router = Router();


router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit);
        if (limit) {
            const productsLimit = products.slice(0, limit);
            res.send(productsLimit);
        } else {
            res.send(products);
        }

    } catch (error) {
        res.send(error);
    }

})


router.get("/:pid", async (req, res) => {
    try {
        const productById = parseInt(req.params.pid);
        const product = await productManager.getPtoductById(productById);
        res.send(product);
    } catch (error) {
        res.send(error.menssage);
    }

})


router.post("/", async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productManager.addProduct(product);
        res.send(newProduct);
    } catch (error) {
        res.send(error.menssage);
    }
})


router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const data = req.body;
        await productManager.updateProduct(productId, data);
        res.send("Endpoint para modificar productos\n (ver información en consola)");
    } catch (error) {
        res.send(error.menssage);
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManager.deleteProduct(productId);
        res.send("Endpoint para eliminar productos\n (ver información en consola)");
    } catch (error) {
        res.send(error.menssage);
    }
})

export { router as productsRouter };