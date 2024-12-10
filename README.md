# DermaScan API

A comprehensive healthcare platform API built with NestJS, focusing on dermatological services, patient-doctor interactions, and medical content management.

<br>


## 📚 API Documentation

[click here](https://documenter.getpostman.com/view/39388595/2sAYBRGa24)

<br>

## Features

- 🔐 Authentication & Authorization
- 👥 User Management (Patients & Doctors)
- 📚 Articles
  - ❤️ Favorites System
- 💬 QA Forums
  - 📝 Forum Replies
- 🧠 Skin Lesion Detection
- 🗣️ Consultation

<br>


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
<br>


## Database Diagram

```mermaid
erDiagram
    USER {
        string uid PK
        string role
        string email
        string firstName
        string lastName
        date dob
        string address
        date createdAt
        date updatedAt
        int points
        string photoUrl
    }

    DOCTOR {
        string uid PK
        string specialization
        string workplace
        string documentUrl
        bool isVerified
        string phoneNumber
    }

    PATIENT {
        string uid PK
    }

    ARTICLE {
        string id PK
        text title
        text content
        string imageUrl
        date created_at
        date updated_at
    }

    FAVORITE {
        string id PK
        date created_at
    }

    FORUM {
        string id PK
        text title
        text content
        string status
        date created_at
        date updated_at
    }

    FORUM_REPLY {
        string id PK
        string responder_role
        text content
        date created_at
        date updated_at
    }

    SKIN_LESION {
        string id PK
        string originalImageUrl
        string processedImageUrl
        enum status
        string classification
        string description
        date createdAt
        date processedAt
    }

    CONSULTATION {
        string id PK
        enum status
        date requestedAt
        date acceptedAt
        date completedAt
    }

    CONSULTATION_MESSAGE {
        string id PK
        string content
        date sentAt
    }

    ACTIVITY_LOG {
        string id PK
        string activity
        int points
        date createdAt
    }

    USER ||--o{ DOCTOR : "has one"
    USER ||--o{ PATIENT : "has one"
    USER ||--o{ FAVORITE : "has many"
    USER ||--o{ ACTIVITY_LOG : "has many"
    DOCTOR ||--o{ ARTICLE : "writes"
    DOCTOR ||--o{ CONSULTATION : "conducts"
    PATIENT ||--o{ CONSULTATION : "requests"
    PATIENT ||--o{ FORUM : "creates"
    PATIENT ||--o{ SKIN_LESION : "has many"
    ARTICLE ||--o{ FAVORITE : "is favorited"
    FORUM ||--o{ FORUM_REPLY : "has many"
    FORUM_REPLY ||--o{ USER : "is responded by"
    CONSULTATION ||--o{ CONSULTATION_MESSAGE : "has many"
    CONSULTATION_MESSAGE ||--o{ USER : "is sent by"
```
<br>

## Cloud Architecture Diagram (Google Cloud Platform)

![Cloud Architecture Diagram](https://raw.githubusercontent.com/Bangkit-Capstone-C242-PS028/.github/refs/heads/main/assets/GCP%20Architecture%20DermaScan.png)

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
