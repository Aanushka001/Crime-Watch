# Crime Watch - Real-time Crime Reporting Platform

A full-stack web application for reporting and tracking crime incidents with real-time mapping using OpenStreetMap, Firebase authentication, and Firestore database.

## 🚀 Features

- **Real-time Crime Reporting**: Submit and track crime incidents
- **Interactive Map**: View crime hotspots using OpenStreetMap
- **User Authentication**: Secure login/register with Firebase Auth
- **User Profiles**: Manage user accounts and view reporting history
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark UI for better user experience

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **CSS3** - Custom styling with dark theme
- **Leaflet & React-Leaflet** - OpenStreetMap integration
- **Firebase Web SDK** - Authentication and real-time data
- **Axios** - HTTP client for API calls

### Backend
- **Node.js & Express** - RESTful API server
- **Firebase Admin SDK** - Backend Firebase services
- **Firestore Database** - NoSQL database for crime reports
- **Firebase Authentication** - User management
- **Firebase Hosting** - Frontend deployment

### DevOps
- **Firebase Hosting** - Static site hosting
- **Firebase Functions** - Serverless backend (optional)
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code quality and consistency

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase account with project

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/crime-watch.git
cd crime-watch/crime
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
```

### 3. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: `crime-watch-78c43`
3. Enable Authentication (Email/Password, Google, Facebook)
4. Create Firestore Database
5. Enable Storage (if needed)

#### Environment Setup

**Server Environment** (`server/.env`)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

FIREBASE_PROJECT_ID=crime-watch-78c43
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@crime-watch-78c43.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_DATABASE_URL=https://crime-watch-78c43.firebaseio.com
FIREBASE_STORAGE_BUCKET=crime-watch-78c43.appspot.com
```

**Client Environment** (`client/.env`)
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=crime-watch-78c43.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=crime-watch-78c43
REACT_APP_FIREBASE_STORAGE_BUCKET=crime-watch-78c43.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Firebase Service Account
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Download JSON file and save as `server/serviceAccountKey.json`
4. Extract values to `server/.env`

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm start
```
Server runs on: `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd client
npm start
```
Client runs on: `http://localhost:3000`

### Production Build
```bash
cd client
npm run build
```

## 🌐 Deployment

### Firebase Hosting Deployment
```bash
# Build client
cd client
npm run build

# Deploy to Firebase
cd ..
firebase deploy
```

### Environment Setup for Production
Update client environment variables for production:
```env
REACT_APP_API_URL=https://us-central1-crime-watch-78c43.cloudfunctions.net/api
```

## 📁 Project Structure

```
crime/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/       # Login/Register components
│   │   │   ├── Layout/     # Header, Footer
│   │   │   ├── Map/        # Map components
│   │   │   └── Reports/    # Report forms and lists
│   │   ├── context/        # React context providers
│   │   ├── utils/          # API utilities, Firebase config
│   │   └── App.jsx         # Main App component
│   ├── package.json
│   └── .env
├── server/                 # Express backend
│   ├── config/            # Firebase, CORS configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Authentication, error handling
│   ├── models/           # Data models (User, Report)
│   ├── routes/           # API routes
│   ├── server.js         # Express server
│   └── package.json
├── .github/workflows/     # CI/CD configuration
├── firebase.json          # Firebase configuration
├── .firebaserc           # Firebase project settings
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `DELETE /api/auth/delete` - Delete user account

### Reports
- `POST /api/reports` - Submit new crime report
- `GET /api/reports` - Get user's reports
- `GET /api/reports/public` - Get public reports for map
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

## 🔐 Security Features

- Firebase Authentication with JWT tokens
- Firestore Security Rules for data protection
- CORS configuration for cross-origin requests
- Input validation and error handling
- Environment variable protection

## 🎨 UI/UX Features

- **Dark Theme**: Consistent dark color scheme
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🚀 CI/CD Pipeline

The project includes GitHub Actions for automated testing and deployment:

- **Linting**: ESLint for code quality
- **Testing**: Automated test suite
- **Build**: Production build verification
- **Deployment**: Automatic deployment to Firebase on main branch push

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Authentication Errors**
   - Verify Firebase project configuration
   - Check environment variables
   - Ensure Authentication providers are enabled

2. **CORS Errors**
   - Verify CLIENT_URL in server environment
   - Check CORS configuration

3. **Firestore Permission Denied**
   - Update Firestore security rules
   - Verify service account permissions

4. **Build Failures**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts

### Development Tips

- Use React Developer Tools for debugging
- Monitor Firebase Console for authentication logs
- Check browser console for client-side errors
- Use Postman for API testing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenStreetMap for mapping services
- Firebase for backend services
- React community for components and libraries
- Leaflet for interactive maps

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

**Live Demo**: [https://crime-watch-78c43.web.app](https://crime-watch-78c43.web.app)

**API Documentation**: [https://crime-watch-78c43.web.app/api-docs](https://crime-watch-78c43.web.app/api-docs)

**GitHub Repository**: [https://github.com/yourusername/crime-watch](https://github.com/yourusername/crime-watch)