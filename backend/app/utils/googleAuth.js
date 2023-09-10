const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const opn = require("opn");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} = process.env;

const oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL
);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Set credentials if they exist
if (ACCESS_TOKEN && REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN,
  });
}

const getNewTokens = async () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  console.log("Authorize this app by visiting this URL:", authUrl);
  opn(authUrl);

  const code = ""; // Paste the code here

  if (code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);

    // Store these tokens securely, possibly in environment variables or a secure configuration file
  } else {
    console.log(
      "Please retrieve the code from the URL and paste it in the 'code' variable."
    );
  }
};

// Uncomment the below line for the first run to get the tokens
// getNewTokens();

module.exports = {
  oauth2Client,
  calendar,
};
