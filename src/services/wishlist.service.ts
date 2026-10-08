import { api } from "../lib/api";



export interface WishlistItem {
  id: string;
  event_id: string;
  created_at: string;
  event: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    event_date: string;
    start_time?: string;
    hero_image?: string;
    venue_name?: string;
    status: string;
    tiers?: { price: string | number; is_primary: boolean }[];
  };
}



export const wishlistApi = {
  /**
   * Get current user's wishlist.
   */
  getWishlist: () =>
    api.get<WishlistItem[]>("/wishlist", {
      successMessage: false,
      errorMessage: false,
    }),

  /**
   * Add event to wishlist.
   */
  addToWishlist: (eventId: string) =>
    api.post<{ id: string; event_id: string }>(
      "/wishlist",
      { event_id: eventId },
      {
        successMessage: "Added to wishlist!",
        errorMessage: false,
      }
    ),

  /**
   * Remove event from wishlist.
   */
  removeFromWishlist: (eventId: string) =>
    api.delete(`/wishlist/${eventId}`, {
      successMessage: "Removed from wishlist",
      errorMessage: false,
    }),
};
