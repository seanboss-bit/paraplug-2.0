import api from "../request";

interface ProductQuery {
  search?: string;
  sort?: "newest" | "asc" | "desc";
  category?: string;
  skip?: number;
  limit?: number;
}

interface reviewQuery {
  rating: number;
  comment: string;
}

export const getProducts = async (params?: ProductQuery) => {
  try {
    const res = await api.get("/product", { params });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    throw error;
  }
};

export const getRandomProducts = async () => {
  try {
    const res = await api.get("/product/random");
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch random products:", error);
    throw error;
  }
};

export const getSingleProduct = async (id: string) => {
  try {
    const res = await api.get(`/product/find/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to get product:", error);
    throw error;
  }
};

export const likeProduct = async (productID: string) => {
  try {
    const res = await api.post(`/favourite/${productID}`);
    return res;
  } catch (error) {
    console.error("❌ Failed to like products:", error);
    throw error;
  }
};

export const postAReview = async (params: reviewQuery, productID: string) => {
  try {
    const res = await api.post(`/review/product/${productID}`, params);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to post product review:", error);
    throw error;
  }
};
