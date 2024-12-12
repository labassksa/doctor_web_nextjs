// models/User.ts
export class User {
  id: number;
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string | null;
  role: string;

  constructor({
    id = 0,
    firstName = "",
    lastName = "",
    nationalId = "",
    dateOfBirth = "",
    gender = "",
    phoneNumber = "",
    email = null,
    role = "",
  }: {
    id?: number;
    firstName?: string;
    lastName?: string;
    nationalId?: string;
    dateOfBirth?: string;
    gender?: string;
    phoneNumber?: string;
    email?: string | null;
    role?: string;
  }) {
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
    if (!this.id) return "User ID is required.";
    if (!this.firstName.trim()) return "First name is required.";
    if (!this.lastName.trim()) return "Last name is required.";
    if (!this.nationalId.trim()) return "National ID is required.";
    if (!this.dateOfBirth) return "Date of birth is required.";
    if (!this.gender) return "Gender selection is required.";
    if (!this.phoneNumber) return "Phone number is required.";
    if (!this.role) return "Role is required.";
    return null; // No validation errors
  }
}

export default User;
