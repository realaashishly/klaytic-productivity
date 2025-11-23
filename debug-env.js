require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');
