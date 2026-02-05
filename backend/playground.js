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


// Dummy Node.js backend starter file to show collaboration. No impact on frontend or website hosting.

console.log("This is a dummy server file for collaboration only.");

function unusedFeature() {
    console.log("This feature is a placeholder and not in use by real site.");
}

unusedFeature();
