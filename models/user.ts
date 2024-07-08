// models/User.ts
class User {
  id: number;           // Added id property
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string | null;
  role: string;

  constructor(
    id: number = 0,     // Default id set to 0, consider using null or handling it based on your ID strategy
    firstName: string = "",
    lastName: string = "",
    nationalId: string = "",
    dateOfBirth: string = "",
    gender: string = "",
    phoneNumber: string = "",
    email: string | null = null,
    role: string = ""
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nationalId = nationalId;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.role = role;
  }

  // Method to validate the user info
  validate(): string | null {
    if (!this.id) return "User ID is required.";              // Validation for user ID
    if (!this.firstName.trim()) return "First name is required.";
    if (!this.lastName.trim()) return "Last name is required.";
    if (!this.nationalId.trim()) return "National ID is required.";
    if (!this.dateOfBirth) return "Date of birth is required.";
    if (!this.gender) return "Gender selection is required.";
    if (!this.phoneNumber) return "Phone number is required.";
    if (!this.role) return "Role is required.";
    return null;  // No validation errors
  }
}

export default User;
