import express from "express";
import helmet from "helmet";
import cors from "cors";
import chargesRoutes from './routes/chargesRoutes.js'
const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:5173", // for vite application
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
