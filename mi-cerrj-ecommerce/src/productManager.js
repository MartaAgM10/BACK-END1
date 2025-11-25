import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
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

  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const products = await this._readFile();
    return products.find((p) => p.id === id);
  }

  async add(product) {
    const products = await this._readFile();
    const newProduct = {
      id: uuidv4(),
      status: true,
      thumbnails: [],
      ...product,
    };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async update(id, data) {
    const products = await this._readFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...data, id };
    await this._writeFile(products);
    return products[index];
  }

  async delete(id) {
    const products = await this._readFile();
    const filtered = products.filter((p) => p.id !== id);
    await this._writeFile(filtered);
  }
}

export default ProductManager;
