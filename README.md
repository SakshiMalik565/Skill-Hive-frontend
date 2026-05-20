# SkillHive Frontend Application

The frontend client for SkillHive, built using React.js and Vite. It provides a modern, responsive, and animated user interface optimized for skill swapping, messaging, scheduling, and project management.

---

## 🛠️ Technology Stack
* **Runtime**: Node.js (v20 LTS)
* **Framework**: React (v18)
* **Build Tool**: Vite
* **Styling**: TailwindCSS & Vanilla CSS
* **Routing**: React Router DOM
* **State Management**: React Context API
* **Icons**: React Icons / FontAwesome

---

## ⚙️ Local Development Setup

### 1. Requirements
Ensure you have **Node.js (v20+)** installed.

### 2. Environment Variables
Create a `.env` file in the root folder and configure:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Steps
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
The React development server will start on [http://localhost:5173/](http://localhost:5173/).

---

## 🐳 Dockerization (Multi-Stage Build)

This frontend uses a production-ready multi-stage Docker build to keep images tiny and fast:

1. **Stage 1 (Builder)**: Installs npm packages and runs `npm run build` to compile static HTML, JS, and CSS files.
2. **Stage 2 (Nginx)**: Moves the compiled build outputs (`dist/`) into a lightweight Nginx container to serve the SPA assets with optimized route fallback capabilities.

```bash
# Build the Docker image
docker build -t skillhive-frontend:latest .

# Run the container
docker run -p 8080:80 skillhive-frontend:latest
```
Access the served app at [http://localhost:8080/](http://localhost:8080/).

---

## 🚀 Continuous Integration (CI)

This repository includes a GitHub Actions pipeline (`.github/workflows/ci.yml`) that automatically:
1. Triggers on pushes or PRs to `main` and `dev`.
2. Installs dependencies and runs syntax/mock tests.
3. Builds static assets (`npm run build`).
4. Compiles the container image using the multi-stage Dockerfile.
5. Pushes the image to **DockerHub** using secure workflow credentials.
