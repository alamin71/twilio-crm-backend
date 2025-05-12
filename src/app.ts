import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import contactRoutes from './routes/contact.routes';
const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});
app.use('/api/contacts', contactRoutes);
export default app;
