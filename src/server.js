const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('src/public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
