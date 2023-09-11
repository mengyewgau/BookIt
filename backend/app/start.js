const app = require("./server"); // Make sure the path is correct

// Use the PORT provided by the environment variable or default to 8080
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
