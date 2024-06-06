import express from "express";


import cors from "cors";
import claimsRoutes from './routes/claimsRoutes.js'

const app = express();
const port =  3000;

const corsOptions = {
  origin: "http://localhost:5173", // for vite application
  optionsSuccessStatus: 200,
};

//Middleware
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
