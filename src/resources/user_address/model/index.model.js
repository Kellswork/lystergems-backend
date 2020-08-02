import UserAddress from './user_address.model';

async function createUserAddress(address) {
  return UserAddress.query().insert(address).returning('*');
}

export default createUserAddress;
