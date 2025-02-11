# README.md

# Vulnerable Web Application

This project is a vulnerable web application designed for testing security vulnerabilities. It includes functionalities such as user registration and login, with a focus on demonstrating common security flaws.

## Project Structure

- **src/**
  - **database/**
    - `config.js`: Configuration settings for connecting to the database.
    - `db.js`: Handles database connection and user interactions.
  - **public/**
    - **css/**
      - `styles.css`: Styles for the website.
    - **js/**
      - `script.js`: Client-side JavaScript for user interactions.
  - **routes/**
    - `auth.js`: Authentication routes for login and registration.
    - `users.js`: User-related functionalities.
  - **views/**
    - `login.html`: HTML structure for the login page.
    - `dashboard.html`: HTML structure for the dashboard page.
  - `app.js`: Main application file for middleware and routes.
  - `server.js`: Starts the server and listens for requests.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd vulnerable-web-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   node src/server.js
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Security Notice

This application is intentionally vulnerable and should only be used in a controlled environment for educational purposes. Do not deploy it in a production setting.