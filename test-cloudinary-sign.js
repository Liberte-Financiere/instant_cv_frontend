require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const url = cloudinary.url('jobsira-cv-photos/xqs8itoq5ry3ihcnhsjf.pdf', { sign_url: true, secure: true, flags: 'attachment' });
console.log(url);
