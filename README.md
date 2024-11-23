<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  </p>

  [circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
  [circleci-url]: https://circleci.com/gh/nestjs/nest

  ## Description

  This project is a backend application for managing doctors, built using the NestJS framework. It provides APIs for creating, updating, and retrieving doctor information.

  ## Installation

  ```bash
  $ yarn install
  ```

 # Project Setup Instructions

  ### 1. Install Docker  
  First, you need to install Docker. You can download and install it from the following link:  
  [Docker Official Website](https://www.docker.com/)

  **Note:** You need remane the file .env.template to .env and use this credentials and add the wompi credentials and google credentials
  
  ### 2. Run the database 
  Once Docker is installed, navigate to the project directory and execute the following command (cmd, powershell):  
  ```bash
  docker-compose up -d
  ```
  This process will set up and run the database using PostgreSQL.

  ### 3. Insert the Database Structure
  After the database is running, navigate to the `database` folder inside the project directory. Inside, you’ll find a file named `tables.sql`. This file contains the necessary SQL        queries to set up the database structure.

  You need to execute these queries using a `PostgreSQL` console or a database management tool like `TablePlus`.

  The database credentials (username, password, etc.) are located in the `.env` file in the project directory. Make sure to use these credentials to connect to the database.

  ## Running the app

  ```bash
  # development
  $ yarn run start

  # watch mode
  $ yarn run start:dev

  # production mode
  $ yarn run start:prod
  ```
  ## License

  Nest is [MIT licensed](LICENSE).
