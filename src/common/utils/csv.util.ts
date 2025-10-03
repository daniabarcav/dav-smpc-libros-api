import { format } from 'fast-csv';

export function toCSV(rows: Record<string, any>[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = format({ headers: true });

    stream.on('error', reject);
    stream.on('data', (c) => chunks.push(Buffer.from(c)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));

    rows.forEach(r => stream.write(r));
    stream.end();
  });
}
