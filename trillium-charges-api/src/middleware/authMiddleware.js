import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization; //  Header is in the format "Bearer <token>"
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
    if (response.data.valid) {
      next();
    } else {
      res
        .status(401)
        .json({ responseCode: 117, responseType: 117, error: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ responseCode: 117, responseType: 117, error: "Unauthorized " });
  }
};
