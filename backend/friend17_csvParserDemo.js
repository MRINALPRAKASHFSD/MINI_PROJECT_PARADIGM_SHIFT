// friend17_csvParserDemo.js
// Author: Jay Malhotra
// Shows how to parse a CSV string into an array of objects (pure JS).

const csv = `id,name,role
1,Ajay,HR
2,Meena,Admin`;

const lines = csv.split('\n');
const headers = lines[0].split(',');

const objects = lines.slice(1).map(line => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
});

console.log("Parsed CSV Data:", objects);
