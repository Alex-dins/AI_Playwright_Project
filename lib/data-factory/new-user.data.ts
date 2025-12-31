import { UserRegister } from "../interfaces/user-register.interface";
import { faker } from "@faker-js/faker";

export const generateUserData = (): UserRegister => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: faker.date
      .birthdate({ min: 18, max: 65, mode: "age" })
      .toISOString()
      .split("T")[0],
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.countryCode(),
    phone: faker.string.numeric(11),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 20, prefix: "0#" }),
  };
};
