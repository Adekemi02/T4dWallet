// Import express
import express from "express";
import env from "dotenv";
env.config();
import cors from "cors";
import { connectDB } from "./database/connections/db";
import bodyParser from "body-parser";
import authRouter from "./auth/routes";
import usersRouter from "./users/user-route";
import walletRouter from "./wallets/routes";
import beneficiaryRouter from "./beneficiaries/routes";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// connect to mongoose
connectDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/beneficiaries", beneficiaryRouter);

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
