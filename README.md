# Barangay San Antonio Information Hub

This fullstack project is a website for Barangay San Antonio. It's an online barangay website where people can find info, news, and forms. It has a public section, a section for admins (barangay officials), and a section for residents. We also used AI for chatbots.

## Project Structure

The project has two main parts:

- **`client/`**: The website you see, built with React.
- **`server/`**: The "backend" that powers the website, built with Node.js and Express. It uses Firebase for login and data storage.

## What You Need

Please make sure you have these installed:

- **Node.js** (version 18 or newer is best) and **npm** (usually comes with Node.js). This is the engine that runs the code.
- **Firebase Account**: You need a Firebase project with Firestore (a database) and Authentication (for logins) enabled.
- **Google Cloud SDK**: Needed to deploy the website on Google Cloud Run.
- **Docker**: Needed for building the project using containers.

## How to Run the Project (Local Setup)

These steps help you run the website on your own computer, for testing.

### 1. Get the Code

Open your terminal (where you type commands) and enter:

```bash
git clone https://github.com/kyleconciso/barangay-hub-ITS122L
cd barangay-info-hub
```

Replace `<repository_url>` with the link to your project's code (on GitHub, for example). This downloads the code.

### 2. Set Up the Server (Backend)

#### 2.1. Firebase Setup

1.  **Create a Firebase Project:** If you don't have one, create a Firebase project here: [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  **Turn on Firestore:** In your Firebase project, find "Firestore Database" and create a database. Choose "Start in test mode" for now.
3.  **Turn on Authentication:** Find "Authentication" and enable "Email/Password" login.
4.  **Get Your Secret Key:**
    - Go to your Firebase project settings (gear icon).
    - Go to "Service accounts".
    - Click "Generate new private key". This downloads a file (e.g., `serviceAccountKey.json`).
    - **VERY IMPORTANT:** Put this `serviceAccountKey.json` file inside the `server/config` folder. The`.gitignore` file already ignores it, you may double check to be sure. Rename the file to `serviceAccountKey.json`.
5.  **Update Client Config:** Open `config/clientConfig.js` (and `client/src/api/config.js`, after you run `config.bat`). Change the `firebaseConfig` part with your project's details (API key, auth domain, etc.). You can find these in your Firebase project settings.
6.  **Change base URL**: Open `client/src/api/config.js` and set `baseURL` to: `http://localhost:8080/api/v1/`

#### 2.2. Install Server Packages

```bash
cd server
npm install
```

This installs all the packages the server needs.

#### 2.3. Add Optional Sample Data

The server includes a script to add some sample data to Firestore. This is helpful for testing.

1.  **Change `server/populate/data.json` (Optional):** You can modify this file to add your own sample data (pages, forms, news, etc.).
2.  **Run the script:**

    ```bash
    node populate/populate.js
    ```

    This script will _delete_ any existing data in Firestore and then add the data from `data.json`.

#### 2.4. Run the Server

```bash
npm start
```

The server will start. You should see "Server is running on port 8080" in the terminal.

### 3. Set Up the Client (Frontend)

#### 3.1. Install Client Packages

Open a _new_ terminal window (leave the server running) and go to the `client` folder:

```bash
cd client
npm install
```

#### 3.2. Run the Client

```bash
npm start
```

This starts the website. Your browser should open to `http://localhost:3000`. If not, open your browser and go there.

### 4. How to Use the Website

- **Regular Website:** `http://localhost:3000`
- **Admin Page:** You need to create an admin user first:
  1.  Sign up on the website.
  2.  Go to your Firebase console, find the user in "Authentication," and copy their "UID" (a long ID).
  3.  Go to Firestore, find the user in the `users` collection.
  4.  Change the `type` to `ADMIN`. You can also change `role` here.
  5.  Log in with the admin user's email and password. You should go to the `/admin` page.
- **User Page:** Sign up as a regular user, and you can go to the `/user` page after logging in.

### 5. Stopping the Website

To stop, press `Ctrl + C` in each terminal window where the server and client are running.
