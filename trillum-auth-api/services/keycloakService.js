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

class ClinicIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClinicIdError";
  }
}
export const getToken = async (username, password, clinicId) => {
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

    // Decode the token to check roles and clinicId
    const decodedToken = jwt.decode(data.access_token);
    const roles = decodedToken.realm_access?.roles || [];
    const userClinicId = decodedToken?.clinicId;
    // console.log(userClinicId);
    if (!roles.includes("BILLER")) {
      throw new RoleError(
        "Access denied: User does not have the required role."
      );
    }
    if (userClinicId !== clinicId) {
      throw new ClinicIdError(
        "Access denied: User does not belong to the specified clinic."
      );
    }
    return data;
  } catch (error) {
    if (error.response) {
      // Keycloak-specific error handling
      throw new Error(
        ` Error: ${
          error.response.data.error_description || error.message
        }`
      );
    } else if (error instanceof RoleError) {
      throw error;
    } else if (error instanceof ClinicIdError) {
      throw error
    } else {
      // Network or other errors
      throw new Error(`Failed to retrieve user token: ${error.message}`);
    }
  }
};
