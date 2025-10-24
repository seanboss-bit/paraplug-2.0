import api from "../request";

interface loginParams {
  email: string;
  password: string;
}

interface registerParams {
  fullName: string;
  username: string;
  email: string;
  image: string;
  password: string;
}
export const loginUser = async (params: loginParams) => {
  try {
    const res = await api.post("/user/login", params);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (params: registerParams) => {
  try {
    const res = await api.post("/user", params);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Register User:", error);
    throw error;
  }
};

export const verifyEmail = async (id: string, token: string) => {
  try {
    const res = await api.get(`/user/${id}/${token}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Verify User:", error);
    throw error;
  }
};
