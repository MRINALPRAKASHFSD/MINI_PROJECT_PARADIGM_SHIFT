// friend7_emailDemo.js
// Author: Aman Joshi
// Sample code to show how to "send" emails in Node.js. Not functional, just a demo of logic.

function sendEmailMock(to, subject, message) {
    console.log(`
    Sending email to: ${to}
    Subject: ${subject}
    Message: ${message}
    (This is just a simulation. No real email sent!)
    `);
}

// Demonstration
sendEmailMock('user@example.com', 'Welcome!', 'Thank you for joining Paradigm Shift!');
