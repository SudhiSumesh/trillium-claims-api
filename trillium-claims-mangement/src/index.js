import express from "express";
import helmet from "helmet";
import cors from "cors";
import claimsRoutes from './routes/claimsRoutes.js'
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000 || process.env.SERVER_PORT;

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
app.use("/api/v1",claimsRoutes)


// Error handling middleware (uncomment after implemented)
// import { notFound } from "./src/middlewares/notFound.js";
// import { handleError } from "./src/middlewares/handleError.js";
// app.use(notFound);
// app.use(handleError);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
