# Run and deploy your AI Studio app

This contains everything you need to run your app locally and deploy it to GitHub Pages.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project is configured with GitHub Actions for automatic deployment to GitHub Pages.

### Setup

1. **Enable GitHub Pages**: Go to your repository settings → Pages → Source: "GitHub Actions"

2. **Add API Key Secret**: 
   - Go to repository Settings → Secrets and variables → Actions
   - Add a new repository secret named `GEMINI_API_KEY`
   - Set the value to your Gemini API key

3. **Automatic Deployment**: 
   - The app will automatically deploy when you push to the `main` branch
   - The deployment workflow is defined in `.github/workflows/deploy.yml`

### Manual Deployment

You can also build and deploy manually:

```bash
npm run build
# The built files will be in the `dist` folder
```

### Access Your Deployed App

After deployment, your app will be available at:
`https://[your-username].github.io/ProjectCard/`

Replace `[your-username]` with your actual GitHub username.

For this repository, it will be:
`https://piotrlaczkowski.github.io/ProjectCard/`
