import { email_configuration } from '../../config/configuration';
import nodemailer from 'nodemailer';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email_configuration.user,
    pass: email_configuration.password,
  },
});

export { emailTransporter };
