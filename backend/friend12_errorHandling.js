// friend12_errorHandling.js
// Author: Sunil Sinha
// Simple demonstration of try-catch error handling in backend code.

function mayThrowError(success = false) {
    if (!success) throw new Error("Oops, something went wrong!");
    return "Success!";
}

try {
    console.log(mayThrowError(false));
} catch (err) {
    console.error("Caught error:", err.message);
}

console.log(mayThrowError(true));
