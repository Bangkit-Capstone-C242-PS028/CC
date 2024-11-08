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

// Create Favorite Params
export type CreateFavoriteParams = {
  articleId: number;
  userId: string;
};

// Delete Favorite Params
export type DeleteFavoriteParams = {
  articleId: number;
  userId: string;
};

// Create Forum Params
export type CreateForumParams = {
  title: string;
  content: string;
  patientUid: string;
};

// Update Forum Params
export type UpdateForumParams = {
  id: number;
  title?: string;
  content?: string;
  patientUid?: string;
};

// Delete Forum Params
export type DeleteForumParams = {
  id: number;
  patientUid: string;
};
