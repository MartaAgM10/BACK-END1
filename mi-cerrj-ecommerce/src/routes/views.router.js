import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

// Ruta principal: lista productos
router.get("/", async (req, res) => {
  try {
    const result = await ProductModel.paginate(
      {},
      { page: 1, limit: 10, lean: true }
    );

    res.render("home", { products: result.docs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar productos");
  }
});

// Ruta para eliminar un producto de MongoDB
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await ProductModel.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar producto");
  }
});

export default router;
