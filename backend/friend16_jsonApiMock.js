// friend16_jsonApiMock.js
// Author: Preeti Jindal
// Simulates a simple JSON API response for user information.

function getUserApiResponse() {
    return {
        status: "success",
        data: {
            id: 42,
            name: "Jon Doe",
            role: "Admin"
        }
    };
}

console.log("Sample API response:", JSON.stringify(getUserApiResponse(), null, 2));
