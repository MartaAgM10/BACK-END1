import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "carts.json");
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: uuidv4(),
      products: [],
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getProducts(cid) {
    const carts = await this._readFile();
    return carts.find((c) => c.id === cid);
  }

  async addProduct(cid, pid, quantity) {
    const carts = await this._readFile();
    const cart = carts.find((c) => c.id === cid);

    if (!cart) return null;

    const product = cart.products.find((p) => p.product === pid);

    if (product) {
      product.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await this._writeFile(carts);
    return cart;
  }
}

export default CartManager;
