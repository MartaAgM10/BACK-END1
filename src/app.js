import express from "express";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import { connectDB } from "./config/db.js";
import productsRouter from "./routes/products.router.js";

const app = express();
const PORT = 8080;

//const productManager = new ProductManager();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Handlebars
//app.engine("handlebars", handlebars.engine());
app.engine(
  "handlebars",
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  }),
);

app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Router vistas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//  API PRODUCTOS (realizado en la entrega anterior)
//app.get("/api/products", async (req, res) => {
// const products = await productManager.getProducts();
//res.json(products)//;
//});

// Servidor activo
connectDB();
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
