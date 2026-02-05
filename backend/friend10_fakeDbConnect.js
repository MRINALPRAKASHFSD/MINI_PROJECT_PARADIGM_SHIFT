// friend10_fakeDbConnect.js
// Author: Nisha Gupta
// Fake demonstration of connecting to a "database" and running a query.

function connectToFakeDb() {
    console.log("Connecting to fake database...");
    return {
        query: (sql) => {
            console.log(⁠ Executing SQL query: ${sql} ⁠);
            return [{ id: 1, username: 'fake_user' }];
        }
    };
}

const db = connectToFakeDb();
const users = db.query("SELECT * FROM users");
console.log("Queried users:", users);
