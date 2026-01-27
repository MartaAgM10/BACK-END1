import { Router } from "express";
import { ProductModel } from "../models/Product.model.js";
//paginacion, filtros y ordenamientos
const router = Router();
//GET /products?limit=&page=&sort=&query=
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    //busqueda por categoria o status
    if (query) {
      filter.$or = [
        { category: { $regex: query, $options: "i" } },
        { status: query.toLowerCase() === "true" },
      ];
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

    if (sort === "asc") options.sort = { price: 1 };
    else if (sort === "desc") options.sort = { price: -1 };

    const result = await ProductModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});

export default router;
