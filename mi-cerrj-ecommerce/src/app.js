import express from "express";
import ProductManager from "./managers/productManager.js";
import CartManager from "./managers/cartManager.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager();
const cartManager = new CartManager();

// RUTAS DE PRODUCTOS /api/products

app.get("/api/products", async (req, res) => {
  const products = await productManager.getAll();
  res.json(products);
});

app.get("/api/products/:pid", async (req, res) => {
  const product = await productManager.getById(req.params.pid);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});

app.post("/api/products", async (req, res) => {
  const newProduct = await productManager.add(req.body);
  res.status(201).json(newProduct);
});

app.put("/api/products/:pid", async (req, res) => {
  const updated = await productManager.update(req.params.pid, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(updated);
});

app.delete("/api/products/:pid", async (req, res) => {
  await productManager.delete(req.params.pid);
  res.json({ message: "Producto eliminado" });
});

// RUTAS DE CARRITOS /api/carts

app.post("/api/carts", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

app.get("/api/carts/:cid", async (req, res) => {
  const cart = await cartManager.getProducts(req.params.cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  res.json(cart);
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }

  const updatedCart = await cartManager.addProduct(
    req.params.cid,
    req.params.pid,
    quantity
  );

  if (!updatedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(updatedCart);
});

// INICIO DE SERVIDOR
app.listen(8080, () => {
  console.log("Servidor escuchando en puerto 8080");
});
