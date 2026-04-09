# 🚀 Nutino Deployment Guide (Minimum Effort)

I've pushed all the required configuration files directly to your GitHub repository! The project is perfectly pre-configured to be deployed in a few clicks.

Follow these simple steps:

## 1. Backend (Render)
I've created a `render.yaml` specifically to make your backend deployment automatic.

1. Go to your [Render Dashboard](https://dashboard.render.com). 
2. Click **New** -> **Blueprint**.
3. Connect your GitHub repository: `satabartosarkar123/KTJ4`.
4. Render will automatically detect the settings and create a web service named `nutino-server`.
5. During or after setup, go to the **Environment** tab of the newly created service and add the following missing variables:
   - `GEMINI_API_KEY` (Your Gemini API Key)
   - `MONGO_URI` (Your MongoDB Connection String)
   - `NEWS_API_KEY` (Your News API Key)
6. Once deployed, copy your new **Backend URL** (it will look like `https://nutino-server...onrender.com`). You'll need this for Vercel.

---

## 2. Frontend (Vercel)
I've updated `package.json` configurations and created `vercel.json` so React Router works automatically upon deployment.

1. Go to your [Vercel Dashboard](https://vercel.com/new) and click **Add New** -> **Project**.
2. Import the `satabartosarkar123/KTJ4` repository.
3. Configure the following project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `01newssum`.
4. Open the **Environment Variables** section and add:
   - Key: `VITE_API_BASE` 
   - Value: Paste the **Backend URL** from Render. *(Note: make sure there's no trailing slash, e.g. `https://nutino-server.onrender.com`)*
5. Click **Deploy**.

---

## 3. Final Step (Secure CORS Connection)
Right now, the backend will block requests from the new UI. Let's securely combine them.

1. Once Vercel finishes deploying, copy your new **Frontend URL** (e.g., `https://ktj4-frontend.vercel.app`).
2. Go back to your [Render Dashboard](https://dashboard.render.com).
3. Open the `nutino-server` project -> **Environment** section.
4. Add a new environment variable:
   - Key: `FRONTEND_URL`
   - Value: Paste the **Frontend URL** from Vercel *without an ending slash*.
5. Save the variables. Render will briefly auto-restart your backend service.

🎉 **You are done! Your full-stack app is now safely distributed.**
