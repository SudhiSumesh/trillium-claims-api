import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const KEYCLOAK_URL = process.env.KEYCLOAK_BASE_URL;
const KEYCLOAK_REALM_NAME = process.env.KEYCLOAK_REALM_NAME;

class RoleError extends Error {
  constructor(message) {
    super(message);
    this.name = "RoleError";
  }
}

export const getToken = async (username, password) => {
  const tokenConfig = {
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET || "default-secret",
    grant_type: process.env.KEYCLOAK_GRANT_TYPE,
    username,
    password,
    scope: process.env.KEYCLOAK_SCOPE,
  };

  try {
    const { data } = await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM_NAME}/protocol/openid-connect/token`,
      new URLSearchParams(tokenConfig),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    // Decode the token to check roles
    const decodedToken = jwt.decode(data.access_token);
    const roles = decodedToken.realm_access?.roles || [];

    if (!roles.includes("BILLER")) {
      throw new RoleError(
        'Access denied: User does not have the required role.'
      );
    }

    return data;
  } catch (error) {
    if (error.response) {
      // Keycloak-specific error handling
      throw new Error(
        `Keycloak Error: ${
          error.response.data.error_description || error.message
        }`
      );
    } else if (error instanceof RoleError) {
      throw error;
    } else {
      // Network or other errors
      throw new Error(`Failed to retrieve user token: ${error.message}`);
    }
  }
};
