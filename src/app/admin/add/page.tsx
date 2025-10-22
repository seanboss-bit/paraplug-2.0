"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { uploadProduct } from "@/services/admin";

const AddKicksPage = () => {
  const user = useUserStore();

  const [name, setName] = useState("");
  const [mainImg, setMainImg] = useState<FileList | null>(null);
  const [extraImg, setExtraImg] = useState<FileList | null>(null);
  const [price, setPrice] = useState<number | string>("");
  const [slashPrice, setSlashPrice] = useState<number | string>("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState<string[]>([]);
  const [freeShipping, setFreeShipping] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [stockxLink, setStockxLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);
  const uploadMultiple = async (
    file: File
  ): Promise<{ publicId: string; url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "b0krglfv");

    const { data } = await axios.post<{
      public_id: string;
      secure_url: string;
    }>("https://api.cloudinary.com/v1_1/dvo4tlcrx/image/upload", formData);

    console.log(data);
    return { publicId: data.public_id, url: data.secure_url };
  };

  const handleSubmit = async () => {
    if (!name || !mainImg || !price || !category || !extraImg || !size) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      // 🔹 Replace with your API call logic
      const arr: { publicId: string; url: string }[] = [];

      const data = await uploadMultiple(mainImg[0]);

      for (let i = 0; i < extraImg.length; i++) {
        const extraImgData = await uploadMultiple(extraImg[i]);
        arr.push(extraImgData);
      }
      await uploadProduct({
        name,
        image: data?.url,
        category,
        price: Number(price),
        slashPrice: Number(slashPrice),
        description,
        sizes: size,
        freeShipping,
        extraImg: arr.map((item) => item?.url),
        inStock,
        stockxLink,
      });
      toast.success("Kicks added successfully!");
    } catch (error) {
      toast.error("Error adding kicks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto md:px-4">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-center mb-8 text-gray-800"
        >
          Add New Kicks 👟
        </motion.h2>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Name*
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Kicks Name"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Price*
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setPrice(e.target.value);
                  }
                }}
                placeholder="Enter Kicks Price"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Slash Price
              </label>
              <input
                type="number"
                value={slashPrice}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setSlashPrice(e.target.value);
                  }
                }}
                placeholder="Enter Slash Price"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Category*
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select category</option>
                <option value="nike">Nike</option>
                <option value="jordan">Jordan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2 font-medium">
              Description*
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Kicks Description"
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Main Image*
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMainImg(e.target.files)
                }
                className="w-full border rounded-lg px-4 py-2 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Extra Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setExtraImg(e.target.files)
                }
                className="w-full border rounded-lg px-4 py-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Sizes*
              </label>
              <input
                type="text"
                placeholder="e.g. 40, 41, 42"
                onChange={(e) => setSize(e.target.value.split(","))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                StockX Link
              </label>
              <input
                type="text"
                value={stockxLink}
                onChange={(e) => setStockxLink(e.target.value)}
                placeholder="Enter StockX Link"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                Free Shipping
              </label>
              <select
                value={String(freeShipping)}
                onChange={(e) => setFreeShipping(e.target.value === "true")}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-medium">
                In Stock
              </label>
              <select
                value={String(inStock)}
                onChange={(e) => setInStock(e.target.value === "true")}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-medium shadow-md transition-all duration-300 ${
              loading
                ? "opacity-80 cursor-not-allowed"
                : "hover:bg-rose-700 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              "Add New Kick"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AddKicksPage;
