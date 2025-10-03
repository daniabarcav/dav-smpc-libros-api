"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCSV = toCSV;
const fast_csv_1 = require("fast-csv");
function toCSV(rows) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const stream = (0, fast_csv_1.format)({ headers: true });
        stream.on('error', reject);
        stream.on('data', (c) => chunks.push(Buffer.from(c)));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        rows.forEach(r => stream.write(r));
        stream.end();
    });
}
//# sourceMappingURL=csv.util.js.map