# GitHub Repository Tracker

## **Overview**
The GitHub Repository Tracker is a full-stack application designed to simplify the management of GitHub repositories and their latest releases. This app enables users to add repositories, track the latest release information, mark releases as "seen," and visually identify repositories with unseen updates. Built with a secure and scalable architecture, the app integrates React (frontend), Apollo Server (backend), and PostgreSQL for persistent data storage, using GitHub OAuth for user authentication and Octokit for interacting with the GitHub API.

This project not only implements the core requirements but also achieves several stretch goals, demonstrating a thoughtful design approach to scalability, data integrity, and user experience.

---

## **Core Features**

### **Frontend**
- **Intuitive and Responsive UI**: Built with React and TypeScript, the app provides a clean, user-friendly interface, fully responsive for mobile devices.
- **Add and Track Repositories**: Users can add GitHub repository URLs to track updates. The data is persisted in a PostgreSQL database.
- **View Latest Releases**: Displays key details of the latest release, including version and release date.
- **Mark as Seen**: Users can mark a release as "seen" to acknowledge updates. Repositories with unseen updates are visually distinct.
- **Client-Side Caching**: Implemented with Apollo Client to optimize performance and minimize redundant API calls.
- **Filter by Status**: Users can filter repositories based on update status (seen/unseen).

### **Backend**
- **GraphQL API**: Built with Apollo Server, the API supports querying and mutating data efficiently.
- **PostgreSQL Integration**: Persistent storage of user-tracked repositories, release metadata, and user-specific seen statuses.
- **GitHub OAuth**: Secure authentication with HTTP-only cookies, ensuring personalized repository tracking for each user.
- **Octokit Integration**: Used to fetch data directly from GitHub’s API, ensuring up-to-date information.

### **Stretch Goals**
- **Release Details UI**: The app provides a detailed view of release information, including release notes and commit history. This functionality fetches data dynamically via the GitHub API on-demand but does not involve backend storage.
- **Mobile Responsiveness**: The app is fully responsive, ensuring a seamless experience on all devices.

---

## **Setup Instructions**

### **Prerequisites**
- **Node.js** (>= 16.x)
- **PostgreSQL** (installed and running)
- **GitHub Developer Account** for OAuth credentials

### **Environment Variables**
Create a `.env` file with the following variables:
```env
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
GITHUB_REDIRECT_URI=http://localhost:4000/auth/github/callback
DATABASE_URL=postgres://<username>:<password>@localhost:5432/github_tracker
```

### **Installation**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### **Database Setup**
1. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```
2. Seed the database (if needed):
   ```bash
   npx sequelize-cli db:seed:all
   ```

### **Run the Application**
Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:4000`.

Start the frontend:
1. Navigate to the `frontend` folder.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm start
   ```
The frontend will be accessible at `http://localhost:3003`.

---

## **What’s Implemented**

This project fulfills the core requirements and implements several stretch goals, showcasing thoughtful design and robust functionality:

### **Core Requirements**
1. **Frontend**:
   - Responsive UI built with React and TypeScript.
   - Repository management, including adding, viewing, and marking updates as "seen."
   - Visual indicators for repositories with unseen updates.
   - Filter functionality for seen/unseen statuses.

2. **Backend**:
   - GraphQL API for flexible data querying and manipulation.
   - PostgreSQL database to store repository, release, and user-specific data.
   - Secure authentication via GitHub OAuth with HTTP-only cookies.
   - Octokit integration for GitHub API interactions.

3. **Data Synchronization**:
   - A "Refresh" button allows users to manually reload data from GitHub’s API.

### **Stretch Goals Achieved**
- **Release Details UI**: Provides a detailed view of the latest release, including release notes and commit history, fetched dynamically from GitHub. Due to time constraints, this functionality does not involve backend API integration.
- **Mobile Responsiveness**: The app ensures seamless functionality on both desktop and mobile devices.
- **Authentication**: Personalized repository tracking implemented via GitHub OAuth, ensuring secure user sessions.

---

## **Key Design Choices and Trade-offs**

1. **Database Structure**:
   - Repositories, users, and releases are stored in a normalized structure, ensuring no duplication. A junction table (`UserRepository`) links users with their tracked repositories and manages seen statuses.

2. **On-Demand Data Fetching**:
   - Release details (notes and commit history) are fetched directly from GitHub when required, reducing unnecessary database load.

3. **Frontend Filtering**:
   - Status filtering is implemented on the frontend for simplicity. Backend filtering would provide more flexibility but was deprioritized due to time constraints.

4. **Authentication Security**:
   - GitHub OAuth is implemented with HTTP-only cookies for secure and scalable user authentication.

---

## **Future Improvements**

1. **Backend Filtering and Sorting**:
   - Add backend support for filtering and sorting repositories by update status, date, or name.

2. **Periodic Data Sync**:
   - Implement background jobs or GitHub webhooks to automatically synchronize repository updates.

3. **Real-Time Notifications**:
   - Provide in-app or desktop notifications for new updates.

4. **Mock GraphQL Server**:
   - Create a local mock server to speed up frontend development without relying on GitHub API.

5. **Enhanced Release Details**:
   - Integrate backend support for storing and querying release notes and commit history.

---

## **Conclusion**

This project successfully delivers a robust and scalable GitHub Repository Tracker that meets the core requirements and implements several advanced features. It demonstrates a clear focus on user experience, data integrity, and secure authentication, providing an excellent foundation for future enhancements.
