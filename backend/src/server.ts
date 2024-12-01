// Import express
import express from "express";
import env from "dotenv";
env.config();
import cors from "cors";
import { connectDB } from "./database/connections/db";
import bodyParser from "body-parser";
import authRouter from './auth/routes'
import usersRouter from './users/user-route'
import walletRouter from './wallets/routes'
import transferRouter from "./transactions/routes";
import { generateWalletId } from "./utils/helper.functions";
import { initializeWalletStatusCron } from "./wallets/services/wallet-status.cron";



const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// connect to mongoose
connectDB();

// Initialize cron jobs
initializeWalletStatusCron();
 
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', usersRouter)
app.use('/api/v1/wallet', walletRouter)
app.use("/api/v1/transaction", transferRouter)


// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
