import express from "express";
import helmet from "helmet";
import cors from "cors";
import chargesRoutes from './routes/chargesRoutes.js'
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3001 || process.env.SERVER_PORT;

const corsOptions = {
  origin: process.env.CLIENT_ENDPOINT,
  optionsSuccessStatus: 200,
};

//Middleware
// Use Helmet!
app.use(helmet());

app.use(cors(corsOptions));
app.use(express.json());

// API routes
app.use("/api/v1", chargesRoutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
