import Wishlist from './wishlist.model';

export default function addToWishlist(data) {
  return Wishlist.query().insert(data).returning('*');
}
