import { Request, Response } from 'express';
import { loginUser } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  const { twilioSid, twilioToken } = req.body;

  try {
    const token = await loginUser(twilioSid, twilioToken);
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
