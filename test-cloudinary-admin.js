require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

async function checkAsset() {
  try {
    const result = await cloudinary.api.resource('jobsira-cv-photos/xqs8itoq5ry3ihcnhsjf', { resource_type: 'image' });
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAsset();
