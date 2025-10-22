"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { addIGPost, deleteIGPost, getIGPosts } from "@/services/insta";

interface Post {
  _id: string;
  image: string;
  username: string;
}

const Hashtag = () => {
  const [image, setImage] = useState<FileList | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [sloading, setsLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  // 🔹 Cloudinary upload
  const uploadMultiple = async (
    file: File
  ): Promise<{ publicId: string; url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "b0krglfv");

    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dvo4tlcrx/image/upload",
      formData
    );
    return { publicId: data.public_id, url: data.secure_url };
  };

  // 🔹 Upload new post
  const uploadPost = async () => {
    if (!image || !username.trim()) {
      toast.error("Please select an image and enter username");
      return;
    }

    setsLoading(true);
    try {
      const data = await uploadMultiple(image[0]);
      // 🧩 Replace with your API call
      await addIGPost({ image: data.url, username });
      toast.success("Post uploaded successfully!");
      setShowAdd(false);
      setUsername("");
      setImage(null);
      await getPost(); // refresh posts
    } catch (error) {
      console.error(error);
      toast.error("Error uploading post");
    } finally {
      setsLoading(false);
    }
  };

  // 🔹 Get all posts
  const getPost = async () => {
    try {
      const res = await getIGPosts();
      setAllPosts(res.allPost);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // 🔹 Delete post
  const deletePost = async (id: string) => {
    setsLoading(true);
    try {
      await deleteIGPost(id);
      toast.success("Post deleted");
      await getPost();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    } finally {
      setsLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="relative w-full bg-gray-50 dark:bg-gray-900 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-2xl text-xl font-bold text-gray-900 dark:text-gray-100">
          Instagram Pictures
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-rose-600 dark:hover:bg-rose-700 transition"
        >
          <PlusIcon className="w-5 h-5" />
          Add New
        </button>
      </div>

      {loading && (
        <p className="text-center dark:text-gray-300">Loading Posts....</p>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPosts.map((post) => (
          <div
            key={post._id}
            className="relative rounded-2xl overflow-hidden shadow-md group bg-white dark:bg-gray-800"
          >
            <Image
              src={post.image}
              alt={post.username}
              className="w-full h-64 object-cover group-hover:opacity-80 transition"
              width={1100}
              height={1100}
            />
            <button
              onClick={() => deletePost(post._id)}
              className="absolute top-3 right-3 bg-black/70 dark:bg-gray-700 hover:bg-rose-600 dark:hover:bg-rose-700 p-2 rounded-full transition"
            >
              <TrashIcon className="w-5 h-5 text-white" />
            </button>
            <div className="p-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
              @{post.username}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Add New Post
            </h4>

            {/* Image upload */}
            <div className="flex flex-col items-center gap-4 mb-4">
              <label htmlFor="igupload" className="cursor-pointer">
                <Image
                  src={
                    image
                      ? URL.createObjectURL(image[0])
                      : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg"
                  }
                  alt="upload preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  width={1100}
                  height={1100}
                />
              </label>
              <input
                type="file"
                id="igupload"
                accept="image/*"
                onChange={(e) => setImage(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Username + Submit */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={uploadPost}
                disabled={sloading}
                className="bg-black dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-rose-600 dark:hover:bg-rose-700 transition disabled:opacity-60"
              >
                {sloading ? "Uploading..." : "Add Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hashtag;
