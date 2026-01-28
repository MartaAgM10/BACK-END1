import { Router } from "express";
import { CartModel } from "../models/Cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();
// POST /api/carts  creamos carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });

    res.status(201).json({
      status: "success",
      payload: newCart,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// GET /api/carts/:cid   carrito con populate
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate("products.product");
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// POST /api/carts/:cid/products/:pid  agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    const existing = cart.products.find((p) => p.product.toString() === pid);
    if (existing) existing.qty++;
    else cart.products.push({ product: pid, qty: 1 });

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// PUT /api/carts/:cid/products/:pid actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { qty } = req.body;
    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    const productInCart = cart.products.find(
      (p) => p.product.toString() === pid,
    );
    if (!productInCart)
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });

    productInCart.qty = qty;
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// PUT /api/carts/:cid  actualizar todo el carrito con array de productos
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body || {};
    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        message: "Debe enviar un array de productos",
      });
    }
    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// DELETE /api/carts/:cid/products/:pid  eliminar producto
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// DELETE /api/carts/:cid eliminar todos los productos
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
