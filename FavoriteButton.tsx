/*
 * Favorite Button Component
 * Toggle favorite status for businesses
 */

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/favorites";

interface FavoriteButtonProps {
  businessId: string;
  className?: string;
}

export function FavoriteButton({ businessId, className = "" }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(businessId));
  }, [businessId]);

  const handleToggle = () => {
    if (favorited) {
      removeFavorite(businessId);
    } else {
      addFavorite(businessId);
    }
    setFavorited(!favorited);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors ${
        favorited
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
    </button>
  );
}
