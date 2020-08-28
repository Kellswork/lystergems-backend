import User from './user.model';

export function createUser(userInfo) {
  return User.query().insert(userInfo).returning('*');
}

export async function getUserByEmail(email) {
  return User.query().where({ email });
}
export async function verifyUser(id) {
  return User.query().where({ id }).patch({ is_verified: true });
}

export async function updateUserPassword(id, password) {
  return User.query().where({ id }).patch({ password });
}

export async function fetchUserDetails(id) {
  return User.query().where({ id }).first();
}
