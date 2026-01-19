import { UserDomain } from "../interfaces/user-register.interface";
import { ApiUserRegister } from "../types/types";

export const apiUserData = (user: UserDomain): ApiUserRegister => ({
  first_name: user.firstName,
  last_name: user.lastName,
  dob: user.dateOfBirth,
  address: {
    street: user.street,
    city: user.city,
    state: user.state,
    country: user.country,
    postal_code: user.postalCode,
  },
  phone: user.phone,
  email: user.email,
  password: user.password,
});
