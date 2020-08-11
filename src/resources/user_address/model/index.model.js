import UserAddress from './user_address.model';

export async function createUserAddress(address) {
  return UserAddress.query().insert(address).returning('*');
}

export async function patchUserAddress(id, address) {
  return UserAddress.query()
    .where({ id })
    .patch({ ...address, updated_at: UserAddress.fn.now() })
    .returning('*')
    .first();
}
