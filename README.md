# GitHub Repository Tracker

## **Overview**
The GitHub Repository Tracker is a full-stack app for managing GitHub repositories and tracking their latest releases. 
Users can add repositories, mark releases as "seen," and identify updates with visual indicators. Built with React, TypeScript,ShadCN , Express, GraphQL ,Apollo Server, and PostgreSQL it features secure GitHub OAuth authentication and integrates Octokit for GitHub API interactioms.

---

## **What’s Implemented**

This project fulfills the core requirements and implements several stretch goals, showcasing thoughtful design and robust functionality:
![image](https://github.com/user-attachments/assets/fc7e02f5-3355-4e54-8f86-7bc81d4ab9d9)


### **Core Requirements Achieved** (COMPLETE)
1. **Frontend**:
   - Responsive UI built with React,Shadcn and TypeScript.
   - Repository management, including adding, viewing, and marking updates as "seen."
   - Visual indicators for repositories with unseen updates.
   - Filter functionality for seen/unseen statuses.
   - Client Side Caching using Apollo in memory cache
   - Latest Release Information available on Card
   

2. **Backend**:
   - Apollo Server GraphQL backend - wrote modular and clean code.
   - PostgreSQL database => Stores User , Repositories , Releases.etc. Used Database As a Service of EDB.
   - Secure authentication via GitHub OAuth with HTTP-only cookies.
   - Octokit integration for GitHub API interactions.
   - No Data duplicacy . Secure GraphQL endpoint such that no user can query other user's data!

3. **Data Synchronization**:
   - A "Refresh" button allows users to manually reload data from GitHub’s API.

### **Stretch Goals Achieved** 
- **Release Details UI**: Provides a detailed view of the latest release, including release notes and commit history.Due to time constraints, this functionality does not involve backend API integration.
- ![image](https://github.com/user-attachments/assets/dab3ff76-d177-4283-ad64-a2cf83de5563)
- **Mobile Responsiveness**: The app ensures seamless functionality on both desktop and mobile devices.
- ![image](https://github.com/user-attachments/assets/35681328-a375-46be-9795-d764b7e1091b)
- **Authentication**: Personalized repository tracking implemented via GitHub OAuth, ensuring secure user sessions.
- ![image](https://github.com/user-attachments/assets/f2ad043e-20bd-4c99-8ba3-bbdae729d74e)
- ![image](https://github.com/user-attachments/assets/8cb4354b-2de6-4e09-8c04-4f585d506862)

---

## **Key Design Choices and Trade-offs**

1. **Database Structure**:
   - Repositories, users, and releases are stored in a normalized structure, ensuring no duplication. A junction table (`UserRepository`) links users with their tracked repositories and manages seen statuses.
   - So a repository if once has been added to the database it can be tracked by multiple users. Instead of storing the same Repository for every user who might put the same repo so it is quite scalable .       Releases are also not dependent on user.
   - So there's zero duplicacy in database.
   - Secure GraphQL endpoint such that no user can query other user's data! I have access to user's details as a cookie on the backend side which I pass to the context of Apollo Server

 **Repositories Table**

| Column | Type | Details |
| --- | --- | --- |
| `id` | Integer | Primary key |
| `name` | String | Repository name |
| `url` | String | Unique, repository URL |
| `description` | String | Repository description |
| `createdAt` | Date | Timestamp |
| `updatedAt` | Date | Timestamp |

---

 **Releases Table**

| Column | Type | Details |
| --- | --- | --- |
| `id` | Integer | Primary key |
| `repositoryId` | Integer | Foreign key to Repositories |
| `version` | String | Release version |
| `githubReleaseId` | String | Release id unique for github |
| `releaseDate` | Date | Release date |
| `createdAt` | Date | Timestamp |
| `updatedAt` | Date | Timestamp |

---
**UserRepositories Table**

| Column | Type | Details |
| --- | --- | --- |
| `userId` | Integer | Foreign key to Users |
| `repositoryId` | Integer | Foreign key to Repositories |
| `seenReleases` | JSON/Array | Stores IDs or metadata of seen releases |
| `createdAt` | Date | Timestamp |
| `updatedAt` | Date | Timestamp |

 **User Table**
   Pretty simple table stores id,githubId,username,email,avatarUrl,accessToken

2. **On-Demand Data Fetching**:
   - Release details are "refreshed" for a repo during add repository . This update in release will occur for any other users who track it. Apart from the manual refresh.

3. **Authentication Security**:
   - GitHub OAuth is implemented with HTTP-only cookies for secure and scalable user authentication.
     
4. **Clean and Scalable Frontend** :
   - Used  Tailwind CSS ShadCN for faster ui building and less overhead of development and less CSS ship to client.
     
---

## **Future Improvements**
     
1. **Periodic Data Sync**:
   - Implement background jobs or CRON to auto update release data.

2. **Real-Time Notifications**:
   - Provide in-app or desktop notifications (service worker) for new updates.

3. **Enhanced Release Details**:
   - Integrate backend support for storing and querying release notes and commit history.

---

## **Setup Instructions**

### **Prerequisites**
- **Node.js** (>= 18.x or 20.x)
- **PostgreSQL** (installed and running)
- **GitHub Developer Account** for OAuth credentials (unless shared with you)

### **Environment Variables**
Create a `.env` file on the backend with the following variables:
```env
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
GITHUB_REDIRECT_URI=http://localhost:4000/auth/github/callback
NODE_ENV=development
GITHUB_TOKEN=<GITHUB PERSONAL ACCESS TOKEN>
FRONTEND_URL=http://localhost:3003/
```

### backend/src/config/config.json
Normal Sequelize config but requires a postgres db connection (shared over mail if you know me)

### **Installation**
1. Clone the repository:
   git clone https://github.com/Rahul555-droid/github-repo-user-stories

   install backend

   ```bash
   cd backend
   npm install
   ```
   install frontend

   ```bash
   cd frontend
   npm install
   ```


### **Run the Application**
Start the backend server:
```bash
cd backend
npm start
```
The server will run on `http://localhost:4000`.

Start the frontend:
1. Navigate to the `frontend` folder.
2. Start the frontend app:
   ```bash
   npm start
   ```
The frontend will be accessible at `http://localhost:3003`.

---


## **Conclusion**

This project successfully delivers a robust and scalable GitHub Repository Tracker that meets the core requirements and implements several advanced features. It demonstrates a clear focus on user experience, data integrity, and secure authentication, providing an excellent foundation for future enhancements.
