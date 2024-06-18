import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Assuming the header is in the format "Bearer <token>"
    // console.log(token, "Authorization token");
    // Send the token to the authentication microservice for validation
    const response = await axios.post(
      process.env.AUTH_ENDPOINT,
      {},
      {
        headers: {
          Authorization: token, // Set the Authorization header with the received token
        },
      }
    );
    // console.log(
    //   response.data,
    //   "res form auth service ::::::::::::::::::::::::::::::::::::::::::::::::"
    // );
    if (response.data.valid) {

    // req.user = response.data.user; // Attach user information to the request object
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized " });
  }
};
