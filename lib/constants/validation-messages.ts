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
    PHONE: "Please enter a valid phone number",
    POSTCODE: "Invalid postcode format",
    DOB: "Please enter a valid date in YYYY-MM-DD format.",
    DOB_MINIMUM_AGE: "Customer must be 18 years old.",
  },
  LENGTH: {
    PASSWORD_MIN: "Password must be at least 8 characters",
    PHONE_INVALID: "Phone number must be 10 digits",
  },
} as const;
