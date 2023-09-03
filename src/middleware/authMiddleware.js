const { oauth2Client } = require("../utils/googleAuth");
const fs = require("fs");
const path = require("path");

const handleOAuth2Callback = async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens to .env or another file
    fs.appendFileSync(
      path.join(__dirname, "../../.env"),
      `\nACCESS_TOKEN=${tokens.access_token}\nREFRESH_TOKEN=${tokens.refresh_token}`
    );

    res.send("Tokens saved successfully!");
  } catch (error) {
    res.send("Error saving tokens.");
    console.error(error);
  }
};

module.exports = {
  handleOAuth2Callback,
};
