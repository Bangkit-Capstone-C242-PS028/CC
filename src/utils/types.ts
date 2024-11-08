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

export type FindAllUsersParams = {
  role?: string;
  page?: number;
  limit?: number;
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

// Article Params
export type CreateArticleParams = {
  title: string;
  content: string;
  authorUid: string;
};

// Update Article Params
export type UpdateArticleParams = {
  id: number;
  title?: string;
  content?: string;
  authorUid: string;
};

export type FindArticleParams = {
  id: number;
};

export type FindAllArticlesParams = {
  page?: number;
  limit?: number;
};

export type DeleteArticleParams = {
  id: number;
  authorUid: string;
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

export type FindUserFavoritesParams = {
  userId: string;
};

export type FindArticleFavoritesParams = {
  articleId: number;
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

// Create Forum Reply Params
export type CreateForumReplyParams = {
  content: string;
  forumId: number;
  responderUid: string;
  responderRole: string;
};

export type UpdateForumReplyParams = {
  forumId: number;
  replyId: number;
  content: string;
  userUid: string;
  userRole: string;
};

// Delete Forum Reply Params
export type DeleteForumReplyParams = {
  forumId: number;
  replyId: number;
  userUid: string;
  userRole: string;
};

// Find Replies Params
export type FindRepliesParams = {
  forumId: number;
  page?: number;
  limit?: number;
};
