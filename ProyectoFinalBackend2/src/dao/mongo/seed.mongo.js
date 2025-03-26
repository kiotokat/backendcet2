import dbConnect from "../../utils/dbConnect.util.js";
import { usersManager, productsManager } from "./manager.mongo.js";
import bcrypt from "bcrypt";

async function seedDatabase() {
  await dbConnect();

  /* Crear usuarios de prueba */
  const users = [
    { name: "Admin", email: "admin@example.com", password: bcrypt.hashSync("admin123", 10), role: "ADMIN" },
    { name: "Usuario 1", email: "user1@example.com", password: bcrypt.hashSync("user123", 10), role: "USER" },
    { name: "Usuario 2", email: "user2@example.com", password: bcrypt.hashSync("user123", 10), role: "USER" },
    { name: "Usuario 3", email: "user3@example.com", password: bcrypt.hashSync("user123", 10), role: "USER" },
  ];

  /* Insertar usuarios */
  await usersManager.model.deleteMany({});
  await usersManager.create(users);
  console.log(" Created users correctly");

  /* Crear productos de prueba */
  const products = Array.from({ length: 40 }, (_, i) => ({
    title: `Product ${i + 1}`,
    description: `HP Laptop with 6GB ${i + 1}`,
    category: "Laptops",
    price: Math.floor(Math.random() * 500) + 50,
    stock: Math.floor(Math.random() * 100) + 1,
    onsale: Math.random() > 0.5,
    owner_id: users[0]._id,
  }));

  /* Insertar productos */
  await productsManager.model.deleteMany({});
  await productsManager.create(products);
  console.log("Created products correctly");
}

seedDatabase()
  .then(() => console.log("Data base initialized"))
  .catch((err) => console.error(" Error initializing the database:", err));
