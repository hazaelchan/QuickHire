<h1 align="center">QuickHire ✨</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

[Video Tutorial on Youtube](https://youtu.be/Ycg48pVp3SU)

## Deployment Instructions for Netlify

To deploy your site on Netlify, follow these steps:

1. Build the project:
   ```bash
   npm run build
   ```

2. Log in to your Netlify account or create a new one.

3. Click on "New site from Git" and link your repository.

4. Set the build command to:
   ```bash
   npm run build
   ```

5. Set the publish directory to:
   ```
   frontend/dist
   ```

6. Click "Deploy site" to start the deployment process.

About This Course:

-   🚀 Project Setup
-   🗄️ MongoDB Integration
-   💳 Stripe Payment Setup
-   🔐 Authentication System with JWT
-   ✉️ Welcome Emails
-   🎨 Design with Tailwind & DaisyUI
-   🛡️ Data Protection
-   🤝 Connection Requests (Send, Accept, Reject)
-   📝 Creating and Sharing Posts
-   🖼️ Image Upload for Posts and Profiles
-   👤 Profile Creation and Updates
-   👥 Suggested Users Feature
-   👍 Like and Comment on Posts
-   📰 News Feed Algorithm
-   ⌛ And a lot more...

### Setup .env file

```bash
PORT=5000
MONGO_URI=<your_mongo_uri>

JWT_SECRET=<yourverystrongsecret>

NODE_ENV=development

MAILTRAP_TOKEN=<your_mailtrap_token>
EMAIL_FROM=mailtrap@demomailtrap.com
EMAIL_FROM_NAME=<Your_Name>

CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>

CLIENT_URL=http://localhost:5173
```

### Run this app locally

```shell
npm run build
```

### Start the app

```shell
npm run start
```
