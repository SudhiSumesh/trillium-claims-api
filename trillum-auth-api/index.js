import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import  authRoutes from './routes/authRoutes.js'
dotenv.config();
const app = express();

const port =  process.env.SERVER_PORT || 3006;

const corsOptions = {
  origin: process.env.CLIENT_ENDPOINT,
  optionsSuccessStatus: 200,
};

// Use Helmet!
app.use(helmet());

app.use(cors(corsOptions));
app.use(express.json());

//API Routes
app.use("/api/v1/auth",authRoutes );

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
