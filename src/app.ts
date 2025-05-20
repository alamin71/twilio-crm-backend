import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import contactRoutes from './routes/contact.routes';
import callRoutes from './routes/call.routes';
import authRoutes from './routes/auth.routes';
import smsRoutes from './routes/sms.routes';

const app: Application = express();
const allowedOrigins = [
  'http://localhost:5000',
  'http://255.255.255.0:5000',
  'http://example.com',
];

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// cors middleware MUST be used before your routes
app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

// Twilio Voice webhook route (TwiML response)
app.post('/twilio/voice', (req: Request, res: Response) => {
  res.type('text/xml');
  res.send(`
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice">Hello, this is your Twilio call.</Say>
    </Response>
  `);
});

// routes
app.use('/api/contacts', contactRoutes);
app.use('/api/call', callRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sms', smsRoutes);

export default app;
