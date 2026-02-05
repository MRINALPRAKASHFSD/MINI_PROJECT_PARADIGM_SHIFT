// friend18_imageMockServe.js
// Author: Kiran Vyas
// Mocks how a backend might serve an image (not functional, just logic demo).

function serveImage(imageName) {
    console.log(`Serving image: /images/${imageName}`);
    // In real backend: res.sendFile(path.join(__dirname, 'images', imageName));
}

// Demo usage
serveImage("profile.png");
