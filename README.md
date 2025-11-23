# Klaytic - Advanced Productivity Suite

![Klaytic Banner](public/banner.png)

**Klaytic** is a futuristic, AI-powered productivity dashboard designed to streamline your workflow with cutting-edge tools and a stunning, immersive interface. Built with the latest web technologies, it combines task management, global intelligence, and secure asset storage into a single, cohesive platform.

## 🚀 Features

### 🌍 Global Intelligence (The Globe)
*   **AI-Powered Analysis**: Real-time analysis of global trends and regional situations using Google Gemini AI.
*   **Interactive 3D Map**: A beautiful, interactive geometric world map for region selection.
*   **Visualizations**: Dynamic widget generation and AI-generated context images.
*   **Credit System**: Usage-based credit system with database persistence.

### 📋 Task Command (Task Board)
*   **Kanban Workflow**: Drag-and-drop task management (Todo, In Progress, Done).
*   **User Isolation**: Private task boards for each user.
*   **Smart Features**: AI-generated tags and priority sorting.

### 🗄️ Asset Vault
*   **Secure Storage**: File uploading powered by **UploadThing**.
*   **File Management**: Upload, preview, download, and delete files.
*   **Metadata Tracking**: Automatic tracking of file types, sizes, and upload dates in MongoDB.

### 👤 User Profile
*   **Identity Management**: Customizable user profiles (Bio, Role, Social Links).
*   **Database Persistence**: Direct synchronization with MongoDB.
*   **Holographic UI**: A visually striking, sci-fi inspired profile interface.

### 🔐 Authentication & Security
*   **Better Auth**: Robust authentication system supporting Google OAuth and Email/Password.
*   **Session Management**: Secure session handling and protected API routes.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
*   **Authentication**: [Better Auth](https://better-auth.com/)
*   **File Storage**: [UploadThing](https://uploadthing.com/)
*   **AI Model**: [Google Gemini](https://deepmind.google/technologies/gemini/)

## 📦 Getting Started

### Prerequisites
*   Node.js 18+
*   MongoDB Database
*   UploadThing Account
*   Google Cloud Console Project (for OAuth & Gemini)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/realaashishly/Klaytic-Productivity.git
    cd klaytic
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database
    MONGODB_URI=your_mongodb_connection_string
    MONGODB_DB_NAME=klaytic_db

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET=your_random_secret
    BETTER_AUTH_URL=http://localhost:3000
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # File Uploads (UploadThing)
    UPLOADTHING_SECRET=your_uploadthing_secret
    UPLOADTHING_APP_ID=your_uploadthing_app_id

    # AI (Google Gemini)
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
