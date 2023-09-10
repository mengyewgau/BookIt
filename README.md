# 📚 BookIt

BookIt was spawned out my need as a private tutor to keep track of classes, payments, and provide an easy way for parents and students to interact with my schedule

## 🔧 Tech Stack

**ReactJS, ExpressJS, CORS, Morgan**

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
npm start
```

## The environment file should have the parameters as follows

```
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
REDIRECT_URL=http://localhost:4000/oauth2callback
SPECIFIC_CALENDAR_ID=google_specific_calendar_id
ACCESS_TOKEN=access_token
REFRESH_TOKEN=refresh_token
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
