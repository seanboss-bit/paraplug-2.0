import api from "../request";
interface sendMessageParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getIGPosts = async () => {
  try {
    const res = await api.get("/post");
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch posts:", error);
    throw error;
  }
};

export const deleteIGPost = async (id: string) => {
  try {
    const res = await api.delete("/post/" + id);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch post:", error);
    throw error;
  }
};

export const addIGPost = async (params: {
  image: string;
  username: string;
}) => {
  try {
    const res = await api.post("/post", params);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch post:", error);
    throw error;
  }
};

export const sendEmail = async (email: string) => {
  try {
    const res = await api.post("/email", { email });
    return res;
  } catch (error) {
    console.error("❌ Failed to Send Email:", error);
    throw error;
  }
};

export const sendMessage = async (params: sendMessageParams) => {
  try {
    const res = await api.post("/customer", params);
    return res;
  } catch (error) {
    console.error("❌ Failed to fetch posts:", error);
    throw error;
  }
};

export const handleWebsiteReviews = async () => {
  try {
    const res = await api.get("/review/website");
    return res;
  } catch (error) {
    console.error("❌ Failed to fetch Reviews:", error);
    throw error;
  }
};
