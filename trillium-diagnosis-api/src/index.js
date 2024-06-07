import express from "express";
import helmet from "helmet";
import cors from "cors";
import diagnosisRoutes from './routes/diagnosisRoutes.js'

const app = express();
const port = 3002;

const corsOptions = {
  origin: "http://localhost:5173", // for vite application
  optionsSuccessStatus: 200,
};


//Middleware
// Use Helmet!
app.use(helmet());

app.use(cors(corsOptions));
app.use(express.json());

//API Routes
app.use("/api/v1", diagnosisRoutes);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});