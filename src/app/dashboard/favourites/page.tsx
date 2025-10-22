"use client";

import { useEffect, useState } from "react";
import ShoeCard from "@/components/ShoeCard";
import { Product } from "@/interface/interface";
import { handleDashboardFav } from "@/services/dashboard";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFav = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await handleDashboardFav();
      // assuming the API returns something like: { message, favourites: [] }
      setFavourites(res?.favourites || []);
      console.log(res);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Failed to load favourites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFav();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 min-h-[300px]">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Your Favourites
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center text-red-500 font-medium py-8">
          {error}
          <button
            onClick={getFav}
            className="ml-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && favourites.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          You have no favourites yet.
        </p>
      )}

      {/* Favourites List */}
      {!loading && favourites.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favourites.map((fav) => (
            <ShoeCard key={fav._id} product={fav} refresh={getFav} />
          ))}
        </div>
      )}
    </div>
  );
}
