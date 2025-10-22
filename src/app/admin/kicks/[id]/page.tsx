"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getSingleProduct } from "@/services/store";
import { deleteProduct, updateProduct } from "@/services/admin";

interface Shoe {
  _id?: string;
  name?: string;
  price?: number;
  slashPrice?: number;
  category?: string;
  description?: string;
  image?: string;
  extraImg?: string[];
  sizes?: string[];
  stockX?: string;
  freeShipping?: boolean;
  inStock?: boolean;
}

interface UpdatedKicks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const SingleShoe = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [singleItem, setSingleItem] = useState<Shoe>({});
  const [updatedKicks, setUpdatedKicks] = useState<UpdatedKicks>({});
  const [size, setSize] = useState<string[]>([]);

  // 🧩 Placeholder: Fetch shoe details
  const getItem = async () => {
    try {
      setLoading(true);
      const res = await getSingleProduct(id);
      setSingleItem(res.product);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getItem();
  }, [id]);

  // 🧩 Placeholder: Handle update API call
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData: any = { ...updatedKicks };

      // ✅ Only include sizes if user entered something
      if (size.length > 0) {
        updatedData.sizes = size;
      }

      // ✅ Prevent sending empty updates
      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes to update");
        return;
      }

      console.log(updatedData);
      await updateProduct(id, updatedData);
      toast.success("Kicks updated successfully!");
      router.push("/admin/kicks");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update shoe");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Placeholder: Delete shoe API call
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      await deleteProduct(id);
      toast.success("Shoe deleted!");
      router.push("/shoes");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setUpdatedKicks((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="bg-gray-50 md:py-10 md:px-4">
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* 🖼️ Image Section */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative w-64 h-64 rounded-xl overflow-hidden border">
              {singleItem?.image ? (
                <Image
                  src={singleItem.image}
                  alt={singleItem.name ?? "Shoe Image"}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <button
              onClick={handleDelete}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all"
            >
              Delete Shoe
            </button>
          </div>

          {/* 🧾 Form Section */}
          <form
            onSubmit={handleUpdate}
            className="flex-1 space-y-6 md:border-l md:pl-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Edit Shoe Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={singleItem?.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={singleItem?.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Slash Price
                </label>
                <input
                  type="number"
                  name="slashPrice"
                  defaultValue={singleItem?.slashPrice}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={singleItem?.category ?? ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  <option value="nike">Nike</option>
                  <option value="jordan">Jordan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={singleItem?.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  defaultValue={singleItem?.sizes?.join(",")}
                  onChange={(e) => setSize(e.target.value.split(","))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  StockX Link
                </label>
                <input
                  type="text"
                  name="stockX"
                  defaultValue={singleItem?.stockX}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Free Shipping
                </label>
                <select
                  name="freeShipping"
                  defaultValue={String(singleItem?.freeShipping)}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  In Stock
                </label>
                <select
                  name="inStock"
                  defaultValue={String(singleItem?.inStock)}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all"
              >
                {loading ? "Updating..." : "Update Shoe"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SingleShoe;
