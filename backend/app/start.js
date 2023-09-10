// start.js
const app = require('./server'); // Make sure the path is correct
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
