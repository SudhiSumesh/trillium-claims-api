import { getToken } from "../services/keycloakService.js";

export const loginController = async (req, res) => {
  const { userName, password, clinicId } = req.body;
  try {
    if (!clinicId || !userName || !password) {
      return res.status(400).res.status(400).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "  Required feilds are missing",
        accessToken: null,
      });
    }
    const token = await getToken(userName, password);
    res.json({
      responseCode: 0,
      responseType: 0,
      data: token,
      error: null,
      //   accessToken: null,
    });
  } catch (error) {
    console.log(error, "name");
    if (error.name === "RoleError") {
      res.status(403).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: error?.message,
        accessToken: null,
      });
    } else {
      res.status(401).json({
        responseCode: 1,
        responseType: 1,
        data: [],
        error: "Invalid credentials",
        accessToken: null,
      });
    }
  }
};
