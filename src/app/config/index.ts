// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join((process.cwd(), '.env')) });

// export default {
//   port: process.env.PORT,
//   database_url: process.env.DATABASE_URL,
// };
import dotenv from 'dotenv';
import path from 'path';

// process.cwd() ও '.env' কে আলাদা আর্গুমেন্ট হিসেবে পাঠাতে হবে, নইলে কাজ করবে না
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL || '',
};
