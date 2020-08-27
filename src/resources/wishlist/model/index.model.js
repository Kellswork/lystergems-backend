import Wishlist from './wishlist.model';

export async function addToWishlist(data) {
  return Wishlist.query().insert(data).returning('*');
}

export async function fetchUserWishlist(userId) {
  return Wishlist.query().select('*').where({ user_id: userId });
}
