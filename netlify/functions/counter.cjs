const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Dynamically resolve the absolute path to firebase-key.json at the root
const serviceAccountPath = path.resolve(process.cwd(), 'netlify/functions/firebase-key.json');

// Optional debug
if (!fs.existsSync(serviceAccountPath)) {
  console.error('🔥 firebase-key.json not found at:', serviceAccountPath);
  throw new Error('Missing firebase-key.json');
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const counterDoc = db.collection('downloads').doc('count');

exports.handler = async function (event) {
  try {
    if (event.httpMethod === 'POST') {
      await db.runTransaction(async (t) => {
        const doc = await t.get(counterDoc);
        const newCount = (doc.exists ? doc.data().value : 0) + 1;
        t.set(counterDoc, { value: newCount });
      });
    }

    const doc = await counterDoc.get();
    const count = doc.exists ? doc.data().value : 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };
  } catch (err) {
    console.error('❌ Counter error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to access counter' }),
    };
  }
};
