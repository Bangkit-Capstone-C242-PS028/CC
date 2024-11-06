// User Signup Params
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

// Article Params
export type CreateArticleParams = {
  title: string;
  content: string;
};

// Update Article Params
export type UpdateArticleParams = {
  title?: string;
  content?: string;
};
