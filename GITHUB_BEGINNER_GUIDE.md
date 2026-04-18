# GitHub for Complete Beginners

A **super detailed, step-by-step guide** for people who have never used GitHub before.

---

## 📋 What is GitHub?

Think of GitHub as a **cloud storage service for code** that also tracks all changes you make.

**Simple analogy:** 
- Google Drive = Cloud storage for documents
- GitHub = Cloud storage for code + automatic backup of every change

---

## 🎯 What We're Doing

We're going to:
1. Create a GitHub account
2. Create a "repository" (folder) on GitHub
3. Upload your code to GitHub
4. Set up automatic deployment to Railway

---

## ⏱️ Time Required

- Creating GitHub account: 5 minutes
- Creating repository: 5 minutes
- Uploading code: 10 minutes
- Setting up deployment: 15 minutes
- **Total: ~35 minutes**

---

## PART 1: Create GitHub Account

### Step 1: Go to GitHub.com

1. Open your web browser (Chrome, Safari, Firefox, Edge)
2. Go to **https://www.github.com**
3. You should see the GitHub homepage

### Step 2: Click "Sign Up"

1. Look for the **"Sign up"** button in the top right corner
2. Click it
3. You'll see a form to create an account

### Step 3: Enter Your Email

1. In the **"Email address"** field, enter your email
2. Example: `yourname@gmail.com`

### Step 4: Create Password

1. In the **"Password"** field, create a strong password
2. Example: `MyP@ssw0rd123!`
3. **Important:** Write this down somewhere safe!

### Step 5: Enter Username

1. In the **"Username"** field, enter a username
2. This is what people will see
3. Example: `john-smith` or `jsmith`
4. GitHub will tell you if it's available

### Step 6: Email Preferences

1. GitHub asks if you want updates
2. You can choose **"No"** to skip this

### Step 7: Verify You're Human

1. Click the checkbox: **"I'm not a robot"**
2. You might need to solve a puzzle

### Step 8: Create Account

1. Click the **"Create account"** button
2. GitHub will send you a verification email

### Step 9: Verify Email

1. Check your email inbox
2. Find the email from GitHub
3. Click the verification link
4. You're done! Your account is created

---

## PART 2: Create a Repository

A "repository" is just a folder on GitHub where you store your code.

### Step 1: Go to Your GitHub Dashboard

1. After logging in, you should see your dashboard
2. If not, click your profile icon in the top right corner
3. Select **"Your repositories"**

### Step 2: Click "New"

1. Look for a green **"New"** button on the left side
2. Click it
3. You'll see a form to create a new repository

### Step 3: Enter Repository Name

1. In the **"Repository name"** field, type:
   ```
   life-event-automation
   ```
2. This is the name of your project folder

### Step 4: Add Description (Optional)

1. In the **"Description"** field, you can type:
   ```
   Life Event Automation Platform - Never forget important dates
   ```
2. This helps people understand what your project does

### Step 5: Choose Visibility

1. You'll see two options:
   - **Public** - Anyone can see your code
   - **Private** - Only you can see your code

2. For now, choose **"Public"** (it's free)
3. You can change this later

### Step 6: Initialize Repository

1. Check the box: **"Add a README file"**
2. This creates a file that describes your project

### Step 7: Create Repository

1. Click the green **"Create repository"** button
2. Wait a few seconds
3. Your repository is created!

### Step 8: You're on Your Repository Page

You should now see a page that looks like this:

```
life-event-automation
Public

📁 Code    📋 Issues    🔀 Pull requests    📊 Projects    ...

README.md
```

**Congratulations! Your repository is created!** 🎉

---

## PART 3: Upload Your Code to GitHub

Now we need to upload your code files to GitHub. There are two ways:

### Option A: Upload via Website (Easiest for Beginners)

#### Step 1: Click "Add file"

1. On your repository page, look for a button that says **"Add file"**
2. Click it
3. Select **"Upload files"**

#### Step 2: Upload Files

1. You'll see an area that says **"Drag files here"**
2. Open your file explorer on your computer
3. Navigate to: `/home/ubuntu/life-event-automation`
4. Select all the files and folders
5. Drag them into the GitHub upload area
6. Or click to browse and select files

#### Step 3: Commit Changes

1. Scroll down to the bottom
2. In the **"Commit changes"** section:
   - Leave **"Commit directly to the main branch"** selected
3. Click **"Commit changes"**
4. Wait for files to upload

**Done! Your files are now on GitHub!** ✅

---

### Option B: Upload via Command Line (More Advanced)

If you want to use the command line (terminal), follow these steps:

#### Step 1: Open Terminal

**On Mac:**
1. Press `Command + Space`
2. Type `terminal`
3. Press Enter

**On Windows:**
1. Press `Windows + R`
2. Type `cmd`
3. Press Enter

**On Linux:**
1. Press `Ctrl + Alt + T`

#### Step 2: Navigate to Your Project

```bash
cd /home/ubuntu/life-event-automation
```

#### Step 3: Initialize Git

```bash
git init
```

#### Step 4: Add All Files

```bash
git add .
```

#### Step 5: Create First Commit

```bash
git commit -m "Initial commit: Life Event Automation Platform"
```

#### Step 6: Add GitHub as Remote

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/life-event-automation.git
```

#### Step 7: Rename Branch to Main

```bash
git branch -M main
```

#### Step 8: Push to GitHub

```bash
git push -u origin main
```

**Done! Your code is now on GitHub!** ✅

---

## PART 4: Add GitHub Secrets (API Keys)

Your code needs API keys to work (SendGrid, Stripe, etc.). We need to add these to GitHub **securely**.

### Step 1: Go to Settings

1. On your repository page, click the **"Settings"** tab
2. It's at the top right of your repository

### Step 2: Find Secrets

1. On the left sidebar, look for **"Secrets and variables"**
2. Click it
3. Select **"Actions"**

### Step 3: Click "New repository secret"

1. You should see a button that says **"New repository secret"**
2. Click it

### Step 4: Add First Secret

Let's add SendGrid API key as an example:

1. In the **"Name"** field, type:
   ```
   SENDGRID_API_KEY
   ```

2. In the **"Secret"** field, paste your SendGrid API key
   - Get this from: https://app.sendgrid.com/settings/api_keys

3. Click **"Add secret"**

### Step 5: Repeat for All Secrets

Add these secrets one by one:

**Email Service:**
- `SENDGRID_API_KEY` - From SendGrid
- `SENDGRID_FROM_EMAIL` - Your email address

**SMS Service:**
- `TWILIO_ACCOUNT_SID` - From Twilio
- `TWILIO_AUTH_TOKEN` - From Twilio
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

**Payments:**
- `STRIPE_SECRET_KEY` - From Stripe
- `STRIPE_PUBLISHABLE_KEY` - From Stripe

**Storage:**
- `AWS_ACCESS_KEY_ID` - From AWS
- `AWS_SECRET_ACCESS_KEY` - From AWS
- `AWS_S3_BUCKET` - Your S3 bucket name
- `AWS_REGION` - Your AWS region (e.g., us-east-1)

**Maps:**
- `GOOGLE_MAPS_API_KEY` - From Google Cloud

**Video:**
- `HEYGEN_API_KEY` - From HeyGen

**Facebook:**
- `FACEBOOK_APP_ID` - From Facebook
- `FACEBOOK_APP_SECRET` - From Facebook

**Database:**
- `DATABASE_URL` - From Railway (we'll set this up next)

**Other:**
- `JWT_SECRET` - Any random string, e.g., `my-super-secret-key-12345`

---

## PART 5: Deploy to Railway

Railway is the hosting service that will run your app. Here's how to connect it to GitHub:

### Step 1: Go to Railway.app

1. Open your browser
2. Go to **https://railway.app**
3. Click **"Start Project"**

### Step 2: Sign Up

1. Click **"Sign up with GitHub"**
2. GitHub will ask for permission
3. Click **"Authorize railway-app"**
4. You'll be redirected to Railway

### Step 3: Create New Project

1. Click **"Create New Project"**
2. Select **"Deploy from GitHub"**

### Step 4: Connect GitHub Repository

1. You'll see a list of your repositories
2. Click on **"life-event-automation"**
3. Railway will connect to your GitHub repo

### Step 5: Configure Environment

1. Railway will ask you to configure environment variables
2. Click **"Add Variable"**
3. For each secret you created on GitHub, add it here:
   - Name: `SENDGRID_API_KEY`
   - Value: Your SendGrid API key
4. Repeat for all variables

### Step 6: Add Database

1. In Railway, click **"+ Create"**
2. Select **"Database"**
3. Select **"PostgreSQL"**
4. Railway will create a database for you

### Step 7: Deploy

1. Railway will automatically deploy your code
2. You'll see a progress bar
3. Once it's done, you'll get a URL like:
   ```
   https://life-event-automation.railway.app
   ```

### Step 8: Test Your App

1. Click the URL
2. Your app should load!

---

## 🎯 Summary: What You Did

You just:

1. ✅ Created a GitHub account
2. ✅ Created a GitHub repository
3. ✅ Uploaded your code to GitHub
4. ✅ Added API keys securely to GitHub
5. ✅ Connected GitHub to Railway
6. ✅ Deployed your app to the internet!

---

## 🚀 Your App is Live!

Your Life Event Automation platform is now running on the internet!

**You can share this URL with anyone:**
```
https://life-event-automation.railway.app
```

---

## ❓ Common Questions

### Q: What if I make a mistake?

**A:** Don't worry! You can:
- Delete the repository and start over
- Edit files directly on GitHub
- Upload new versions of files

### Q: How do I make changes to my code?

**A:** You have two options:

**Option 1: Edit on GitHub (Easy)**
1. Go to your repository
2. Click on a file
3. Click the pencil icon to edit
4. Make changes
5. Click "Commit changes"
6. Railway automatically re-deploys

**Option 2: Edit on Your Computer (Better)**
1. Edit files on your computer
2. Upload new versions to GitHub
3. Railway automatically re-deploys

### Q: How do I check if my app is working?

**A:** 
1. Go to your Railway dashboard
2. Click on your project
3. Look for the **"Deployments"** tab
4. You should see a green checkmark if it's working
5. Click the URL to test your app

### Q: What if my app crashes?

**A:**
1. Go to Railway dashboard
2. Click on your project
3. Look at the **"Logs"** tab
4. You'll see error messages
5. Fix the error in your code
6. Upload new version to GitHub
7. Railway automatically re-deploys

### Q: How much does this cost?

**A:**
- GitHub: Free
- Railway: Free tier ($5/month after free credits)
- Total: ~$5/month to start

---

## 📚 Next Steps

1. **Follow the steps above** to deploy your app
2. **Test your app** by visiting the URL
3. **Make changes** to your code as needed
4. **Monitor your app** on Railway dashboard
5. **Share with users** and gather feedback

---

## 🆘 Need Help?

If you get stuck:

1. **Read the error message** - It usually tells you what's wrong
2. **Check the logs** - Railway shows detailed logs
3. **Google the error** - Chances are someone had the same problem
4. **Ask in Discord** - Join a coding community and ask for help

---

**You've got this! Your app is about to go live! 🚀**

---

**Last Updated:** April 9, 2026
**Version:** 1.0.0
