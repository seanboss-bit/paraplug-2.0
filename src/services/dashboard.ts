import api from "../request";

export const getUserDetails = async (id: string) => {
  try {
    const res = await api.get(`/user/find/details/${id}`);
    return res;
  } catch (error) {
    console.error("❌ Failed to get user:", error);
    throw error;
  }
};

export const handleDashboardFav = async () => {
  try {
    const res = await api.get(`/favourite/my`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to get user Favourites:", error);
    throw error;
  }
};

export const handleReviewProducts = async () => {
  try {
    const res = await api.get(`/product/minimal`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to get Review Products:", error);
    throw error;
  }
};

export const submitProductReview = async (
  productId: string,
  rating: number,
  comment: string
) => {
  try {
    const res = await api.post(`/review/product/${productId}`, {
      rating,
      comment,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to submit product review:", error);
    throw error;
  }
};

// ✅ Submit Website Review
export const submitWebsiteReview = async (rating: number, comment: string) => {
  try {
    const res = await api.post(`/review/website`, {
      rating,
      comment,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to submit website review:", error);
    throw error;
  }
};

export const getUserOrders = async (id: string) => {
  try {
    const res = await api.get(`/order/user/find/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Get User Orders:", error);
    throw error;
  }
};
