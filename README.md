# Doctor Management Backend 🩺

A robust backend application for managing doctors, built with NestJS framework. This system provides comprehensive APIs for doctor information management.

## 📋 Table of Contents

- [Description](#description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [License](#license)

## 🎯 Description

This project serves as a backend application for managing doctors' information. Built using the powerful NestJS framework, it offers a full suite of APIs for creating, updating, and retrieving doctor information with high performance and scalability.

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version)
- Yarn package manager
- Docker and Docker Compose
- PostgreSQL client (optional, for database management)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/DANIELSSF/doctors-backend.git
```

2. Navigate to project directory:
```bash
cd doctors-backend
```

3. Install dependencies:
```bash
yarn install
```

## ⚙️ Environment Configuration

1. Rename `.env.template` to `.env`
2. Configure the following in your `.env` file:
   - Database credentials
   - Wompi credentials
   - Google credentials

## 💾 Database Setup

### 1. Installing Docker

Download and install Docker from the [Official Docker Website](https://www.docker.com/)

### 2. Starting the Database

After configuring your .env file, run the following command in your terminal to start the PostgreSQL database:
```bash
docker-compose up -d
```

### 3. Database Structure Setup

1. Navigate to the `database` folder in the project directory
2. Locate the `tables.sql` file
3. Execute the SQL queries using either:
   - PostgreSQL console
   - Database management tool (e.g., TablePlus)

## 🏃‍♂️ Running the Application

Choose one of the following modes to run the application:

```bash
# Development mode
yarn run start

# Watch mode (auto-reload)
yarn run start:dev

# Production mode
yarn run start:prod
```

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using NestJS</sub>
</div>
