import User from './user.model';
import UserAddress from './user_address.model';

export function createUser(userInfo) {
  return User.query().insert(userInfo).returning('*');
}

export async function createUserAddress(userAddressInfo) {
  return UserAddress.query().insert(userAddressInfo).returning('*');
}

export async function getUserByEmail(email) {
  return User.query().where({ email });
}
export async function updateUserVerification(id) {
  return User.query().where({ id }).patch({ is_verified: true });
}
