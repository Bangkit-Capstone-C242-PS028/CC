// User Types
export type SignUpUserParams = {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
  specialization?: string; // for doctors
  workplace?: string; // for doctors
};

export type FindUserParams = {
  uid: string;
};

export type FindAllUsersParams = PaginationParams & {
  role?: string;
};

export type UpdateUserParams = {
  uid: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  specialization?: string;
  workplace?: string;
};

export type DeleteUserParams = {
  uid: string;
};

// =========================================================================================

// Article Params
export type CreateArticleParams = {
  title: string;
  content: string;
  authorUid: string;
  image: Express.Multer.File;
};

// Update Article Params
export type UpdateArticleParams = {
  id: string;
  title?: string;
  content?: string;
  authorUid: string;
  image?: Express.Multer.File;
};

export type FindArticleParams = {
  id: string;
};

export type DeleteArticleParams = {
  id: string;
  authorUid: string;
};

// =========================================================================================

// Favorite Params
// Create Favorite Params
export type CreateFavoriteParams = {
  articleId: string;
  userId: string;
};

// Delete Favorite Params
export type DeleteFavoriteParams = {
  articleId: string;
  userId: string;
};

export type FindUserFavoritesParams = {
  userId: string;
} & PaginationParams;

export type FindArticleFavoritesParams = {
  articleId: string;
} & PaginationParams;

// =========================================================================================

// Create Forum Params
export type CreateForumParams = {
  title: string;
  content: string;
  patientUid: string;
};

// Update Forum Params
export type UpdateForumParams = {
  id: string;
  title?: string;
  content?: string;
  patientUid?: string;
};

// Delete Forum Params
export type DeleteForumParams = {
  id: string;
  patientUid: string;
};

// =========================================================================================

// Create Forum Reply Params
export type CreateForumReplyParams = {
  content: string;
  forumId: string;
  responderUid: string;
  responderRole: string;
};

export type UpdateForumReplyParams = {
  forumId: string;
  replyId: string;
  content: string;
  userUid: string;
  userRole: string;
};

// Delete Forum Reply Params
export type DeleteForumReplyParams = {
  forumId: string;
  replyId: string;
  userUid: string;
  userRole: string;
};

// Find Replies Params
export type FindRepliesParams = PaginationParams & {
  forumId: string;
};

// =========================================================================================

// Pagination Params
export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
};

// =========================================================================================

// Skin Lesion Types
export type CreateSkinLesionParams = {
  patientUid: string;
  image: Express.Multer.File;
};

export type FindSkinLesionParams = {
  id: string;
  patientUid: string;
};

export type FindAllSkinLesionsParams = PaginationParams & {
  patientUid: string;
};

export type DeleteSkinLesionParams = {
  id: string;
  patientUid: string;
};

export type SkinLesionResponse = {
  id: string;
  originalImageUrl: string;
  processedImageUrl?: string;
  classification?: string;
  status: string;
  createdAt: Date;
  processedAt?: Date;
};

export type PaginatedSkinLesionResponse = PaginatedResponse<SkinLesionResponse>;
