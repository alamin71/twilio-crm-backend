import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

main().catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    const PORT = config.port ? Number(config.port) : 5000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`App is listening on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
