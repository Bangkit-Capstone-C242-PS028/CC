# DermaScan API

A comprehensive healthcare platform API built with NestJS, focusing on dermatological services, patient-doctor interactions, and medical content management.

## Features

- 🔐 Authentication & Authorization
- 👥 User Management (Patients & Doctors)
- 📚 Medical Articles
- 💬 Discussion Forums
- ❤️ Favorites System
- 📝 Forum Replies

## Project Setup

1. Add `.env` file in root directory following `.env.example`

2. Install dependencies

```bash
npm install
```

3. Run the project

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## 📚 API Documentation

### API Endpoints Overview

| Method | Endpoint                   | Auth Required | Roles           | Description                  |
| ------ | -------------------------- | ------------- | --------------- | ---------------------------- |
| POST   | `/auth/signup`             | No            | All             | Create new user account      |
| GET    | `/users/me`                | Yes           | PATIENT, DOCTOR | Get current user profile     |
| PATCH  | `/users/me`                | Yes           | PATIENT, DOCTOR | Update current user profile  |
| DELETE | `/users/me`                | Yes           | PATIENT, DOCTOR | Delete current user account  |
| GET    | `/users`                   | Yes           | PATIENT, DOCTOR | List all users               |
| POST   | `/articles`                | Yes           | DOCTOR          | Create new article           |
| GET    | `/articles`                | Yes           | PATIENT, DOCTOR | List all articles            |
| GET    | `/articles/:id`            | Yes           | PATIENT, DOCTOR | Get article by ID            |
| PATCH  | `/articles/:id`            | Yes           | DOCTOR          | Update article (author only) |
| DELETE | `/articles/:id`            | Yes           | DOCTOR          | Delete article (author only) |
| POST   | `/forums`                  | Yes           | PATIENT         | Create new forum discussion  |
| GET    | `/forums`                  | Yes           | PATIENT, DOCTOR | List all forums              |
| GET    | `/forums/:id`              | Yes           | PATIENT, DOCTOR | Get forum by ID              |
| PATCH  | `/forums/:id`              | Yes           | PATIENT         | Update forum (author only)   |
| DELETE | `/forums/:id`              | Yes           | PATIENT         | Delete forum (author only)   |
| GET    | `/forums/:forumId/replies` | Yes           | PATIENT, DOCTOR | Get forum replies            |
| POST   | `/forums/:forumId/replies` | Yes           | PATIENT, DOCTOR | Add reply to forum           |
| POST   | `/favorites`               | Yes           | PATIENT, DOCTOR | Add article to favorites     |
| GET    | `/favorites/my`            | Yes           | PATIENT, DOCTOR | Get user's favorite articles |
| GET    | `/favorites/articles/:id`  | Yes           | PATIENT, DOCTOR | Get article's favorites      |
| DELETE | `/favorites/articles/:id`  | Yes           | PATIENT, DOCTOR | Remove from favorites        |

### Authentication

All endpoints except `/auth/signup` require Firebase authentication:

```http
Authorization: Bearer <firebase_jwt_token>
```

#### POST /auth/signup

Create a new user account.

- Auth Required: No

Request Body:

```json
{
  "role": "PATIENT | DOCTOR",
  "email": "string",
  "password": "string (8-20 chars, must contain uppercase, lowercase, number, special char)",
  "confirmPassword": "string (must match password)",
  "firstName": "string (2-20 chars, letters only)",
  "lastName": "string (2-20 chars, letters only)",
  "dob": "ISO 8601 date string",
  "address": "string",
  "specialization": "string (required for DOCTOR)",
  "workplace": "string (required for DOCTOR)"
}
```

### User Management

#### GET /users/me

Get current user profile.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

#### PATCH /users/me

Update current user profile.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

Request Body:

```json
{
  "firstName": "string (2-50 chars, optional)",
  "lastName": "string (2-50 chars, optional)",
  "address": "string (5-200 chars, optional)",
  "specialization": "string (2-100 chars, DOCTOR only, optional)",
  "workplace": "string (2-100 chars, DOCTOR only, optional)"
}
```

#### DELETE /users/me

Delete current user account.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

### Medical Articles

#### POST /articles

Create a new medical article.

- Auth Required: Yes
- Roles: DOCTOR only

Request Body:

```json
{
  "title": "string",
  "content": "string"
}
```

#### GET /articles

List all articles with pagination.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

Query Parameters:

- `page`: number (default: 1)
- `limit`: number (default: 10)

#### GET /articles/:id

Get article by ID.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

#### PATCH /articles/:id

Update an existing article.

- Auth Required: Yes
- Roles: DOCTOR only (must be author)

Request Body:

```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

#### DELETE /articles/:id

Delete an article.

- Auth Required: Yes
- Roles: DOCTOR only (must be author)

### Discussion Forums

#### POST /forums

Create a new forum discussion.

- Auth Required: Yes
- Roles: PATIENT only

Request Body:

```json
{
  "title": "string",
  "content": "string"
}
```

#### GET /forums

List all forums with pagination.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

Query Parameters:

- `page`: number (default: 1)
- `limit`: number (default: 10)

#### GET /forums/:id

Get forum by ID.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

#### PATCH /forums/:id

Update a forum.

- Auth Required: Yes
- Roles: PATIENT only (must be author)
- Note: Can only update if status is 'open'

Request Body:

```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

#### DELETE /forums/:id

Delete a forum.

- Auth Required: Yes
- Roles: PATIENT only (must be author)
- Note: Can only delete if status is 'open'

#### GET /forums/:forumId/replies

Get forum replies.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

Query Parameters:

- `page`: number (default: 1)
- `limit`: number (default: 10)

#### POST /forums/:forumId/replies

Add a reply to forum.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR
- Note: When a doctor replies, forum status changes to 'answered'

Request Body:

```json
{
  "content": "string"
}
```

### Favorites System

#### POST /favorites

Add an article to favorites.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

Request Body:

```json
{
  "articleId": "number"
}
```

#### GET /favorites/my

Get user's favorite articles.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

Query Parameters:

- `page`: number (default: 1)
- `limit`: number (default: 10)

#### GET /favorites/articles/:id

Get users who favorited an article.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR

Query Parameters:

- `page`: number (default: 1)
- `limit`: number (default: 10)

#### DELETE /favorites/articles/:id

Remove an article from favorites.

- Auth Required: Yes
- Roles: PATIENT, DOCTOR
  <br>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
