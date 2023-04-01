import dotenv from 'dotenv';

dotenv.config();

const url_configuration = {
  start_website: process.env.WEBSTIE_URL as string,
  login_site: process.env.LOGIN_URL as string,
  data_page: process.env.DATA_PAGE as string,
};

const user_configuration = {
  name: process.env.USER as string,
  password: process.env.PASSWORD as string,
};

const email_configuration = {
  user: process.env.MAIL_USER as string,
  password: process.env.MAIL_PASSWORD as string,
  recipient: process.env.MAIL_RECIPIENT as string,
};

export { url_configuration, user_configuration, email_configuration };
