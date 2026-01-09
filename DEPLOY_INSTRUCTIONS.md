# Deploying FilesPad to Render

This guide explains how to deploy your "FilesPad" application to [Render.com](https://render.com) as a single Web Service.

## Prerequisites

1.  **Push your code to GitHub/GitLab**. Ensure your repository contains both `client` and `server` folders and the `package.json` in the root.
    -   *Note*: Make sure your `.gitignore` includes `node_modules` and `.env`. Do NOT commit your `.env` file.

## Steps

1.  **Create a New Web Service**:
    -   Log in to Render.
    -   Click "New +" -> "Web Service".
    -   Connect your GitHub repository.

2.  **Configure the Service**:
    -   **Name**: Choose a name (e.g., `filespad-app`).
    -   **Region**: Select the one closest to you.
    -   **Branch**: `main` (or your working branch).
    -   **Root Directory**: Leave empty (defaults to `.`).
    -   **Runtime**: `Node`
    -   **Build Command**: `npm run build`
        -   *This runs the script in the root package.json which installs dependencies for both folders and builds the React app.*
    -   **Start Command**: `npm start`
        -   *This starts the Node.js server.*

    > **Warning**: On Render's Free Tier, the filesystem is ephemeral. Files uploaded to `uploads/` will be deleted when the server restarts (which happens frequently on free tier). For permanent storage, you should implement AWS S3 or Cloudinary.

3.  **Environment Variables**:
    -   Scroll down to the "Environment Variables" section.
    -   Add the keys from your `server/.env` file:
        -   `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas). *You cannot use localhost/127.0.0.1 on Render.*
        -   `SECURITY_KEY`: Your secret key for encryption.
        -   `NODE_ENV`: `production`

4.  **Deploy**:
    -   Click "Create Web Service".
    -   Render will start the build process. It will install dependencies, build the client, and start the server.

## Troubleshooting

-   **MongoDB Connection**: Ensure your MongoDB Atlas IP Whitelist is set to "Allow Access from Anywhere" (0.0.0.0/0) since Render IPs change, or use a VPC peering if available.
-   **Build Failures**: Check the logs. If `npm install` fails, ensure your `package.json` syntax is correct.
