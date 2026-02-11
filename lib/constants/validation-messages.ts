// tests/constants/validationMessages.ts
export const VALIDATION_MESSAGES = {
  REQUIRED: {
    FIRST_NAME: "First name is required",
    LAST_NAME: "Last name is required",
    DOB: "Date of Birth is required",
    STREET: "Street is required",
    POSTCODE: "Postcode is required",
    CITY: "City is required",
    STATE: "State is required",
    COUNTRY: "Country is required",
    PHONE: "Phone is required",
    EMAIL: "Email is required",
    PASSWORD: "Password is required",
  },
  FORMAT: {
    EMAIL: "Email format is invalid",
    EMAIL_ALREADY_EXISTS: "A customer with this email address already exists.",
    PHONE: "Please enter a valid phone number",
    PHONE_NUMBERS_ONLY: "Only numbers are allowed.",
    POSTCODE: "Invalid postcode format",
    POSTCODE_LENGTH_EXCEEDED:
      "The address.postal code field must not be greater than 10 characters.",
    DOB: "Please enter a valid date in YYYY-MM-DD format.",
    DOB_MINIMUM_AGE: "Customer must be 18 years old.",
    PASSWORD_SPECIAL_CHAR: /Password must include invalid characters./i,
  },
  LENGTH: {
    PASSWORD_MIN: /Password must be minimal 6 characters long./i,
    PHONE_INVALID: "Phone number must be 10 digits",
  },
  SERVER_ERROR: "Internal server error",
} as const;
