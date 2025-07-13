import fs from 'fs';
import path from 'path';

const COUNTER_FILE = path.resolve('/tmp/count.json');

function readCount() {
  try {
    const data = fs.readFileSync(COUNTER_FILE, 'utf8');
    return JSON.parse(data).count || 0;
  } catch {
    return 0;
  }
}

function writeCount(count) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count }));
}

export async function handler(event) {
  let count = readCount();

  if (event.httpMethod === 'POST') {
    count++;
    writeCount(count);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
}
