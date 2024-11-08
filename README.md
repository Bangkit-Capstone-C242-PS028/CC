## Project Setup

1. Add `.env` file in root directory follow `.env.example`

2. Install dependencies

```bash
npm install
```

3. Run the project

```bash
npm run start
```

## API Documentation

### Users

#### Register User

```http
POST /users/signup
```

Body:

```json
{
  "role": "PATIENT" | "DOCTOR",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "firstName": "string",
  "lastName": "string",
  "dob": "ISO 8601 date string",
  "address": "string",
  "specialization": "string", // required if role is DOCTOR
  "workplace": "string" // required if role is DOCTOR
}
```

#### Update User Profile

```http
PATCH /users/:uid
```

Body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "address": "string",
  "specialization": "string", // DOCTOR only
  "workplace": "string" // DOCTOR only
}
```

### Articles

#### Create Article (DOCTOR only)

```http
POST /articles
```

Body:

```json
{
  "title": "string",
  "content": "string"
}
```

#### Get All Articles (DOCTOR, PATIENT)

```http
GET /articles?page=1&limit=10
```

#### Get Article by ID (DOCTOR, PATIENT)

```http
GET /articles/:id
```

#### Update Article (DOCTOR only)

```http
PATCH /articles/:id
```

Body:

```json
{
  "title": "string",
  "content": "string"
}
```

### Forums

#### Create Forum (PATIENT only)

```http
POST /forums
```

Body:

```json
{
  "title": "string",
  "content": "string"
}
```

#### Get All Forums (DOCTOR, PATIENT)

```http
GET /forums?page=1&limit=10
```

#### Get Forum by ID (DOCTOR, PATIENT)

```http
GET /forums/:id
```

#### Update Forum (PATIENT only)

```http
PATCH /forums/:id
```

Body:

```json
{
  "title": "string",
  "content": "string"
}
```

#### Create Forum Reply (DOCTOR, PATIENT)

```http
POST /forums/:forumId/replies
```

Body:

```json
{
  "content": "string"
}
```

#### Update Forum Reply (DOCTOR, PATIENT)

```http
PATCH /forums/:forumId/replies/:replyId
```

Body:

```json
{
  "content": "string"
}
```

#### Get Forum Replies (DOCTOR, PATIENT)

```http
GET /forums/:forumId/replies?page=1&limit=10
```

### Favorites

#### Add Article to Favorites (DOCTOR, PATIENT)

```http
POST /favorites
```

Body:

```json
{
  "articleId": "number",
  "userId": "string"
}
```

#### Get User's Favorites (DOCTOR, PATIENT)

```http
GET /favorites/users/:id?page=1&limit=10
```

#### Get Article's Favorites (DOCTOR, PATIENT)

```http
GET /favorites/articles/:id?page=1&limit=10
```

### Authentication

All endpoints except `/users/signup` require Firebase authentication token:

```http
Authorization: Bearer <firebase_jwt_token>
```

### Common Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

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
