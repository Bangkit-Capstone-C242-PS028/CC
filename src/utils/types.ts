export type SignUpUserParams = {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
  specialization?: string;
  workplace?: string;
};
