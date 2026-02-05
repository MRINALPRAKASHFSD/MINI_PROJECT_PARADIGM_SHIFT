// playground.js
// Contributor: Mahin
const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from the sample API (not used in production)!" });
});

if (require.main === module) {
    app.listen(4000, () => console.log("Sample API running on http://localhost:4000/api/hello"));
};
