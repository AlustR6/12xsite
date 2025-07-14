const admin = require('firebase-admin');

// Only initialize Firebase once
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error('Missing Firebase environment variables');
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

exports.handler = async function () {
  try {
    const docRef = db.collection('downloads').doc('counter');
    const doc = await docRef.get();

    let count = 0;
    if (doc.exists) {
      count = doc.data().count || 0;
    }

    count++;
    await docRef.set({ count });

    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };
  } catch (err) {
    console.error('🔥 Firestore Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
