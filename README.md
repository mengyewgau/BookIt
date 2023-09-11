# 📚 BookIt

BookIt was spawned out of my need as a private tutor to keep track of classes, payments, and provide an easy way for parents and students to interact with my schedule

## 🔧 Tech Stack

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Prerequsites

- Node.js and npm installed
- A Google Cloud Project with Google Calendar API enabled
- OAuth2 credentials for the Google Cloud Project

### Server Design

BookIt uses a Node.js-based server designed to interface with Google Calendar. It provides an API to perform CRUD operations, treating a specific Google Calendar as its primary data storage. This means you can schedule, view, update, and delete events directly on Google Calendar through this server. You can find the repo for BookIt server here https://github.com/mengyewgau/bookit-server

## 🚀 Getting Started

1. **Clone the repository**:

```
git clone https://github.com/mengyewgau/BookIt.git
```

2. **Install dependencies**:

```
cd BookIt
npm install
```

3. **Start the server**:

```
npm run start
```

### ENV file

1. File Format

```
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
REDIRECT_URL=https://yourdomain.com/oauth2callback
SPECIFIC_CALENDAR_ID=google_specific_calendar_id
ACCESS_TOKEN=access_token
REFRESH_TOKEN=refresh_token
```

2. Access and Refresh Token
   If you are not sure how to capture the access and refresh token, delete the lines from your environment file, and do the following.

a. In backend/app/utils/googleAuth.js

```
// Uncomment the below line for the first run to get the tokens
getNewTokens();
```

b. Start the server once and authenticate at localhost:4000

c. Comment the line out again

```
// Uncomment the below line for the first run to get the tokens
// getNewTokens();
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
