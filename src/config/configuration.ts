import dotenv from 'dotenv';

dotenv.config();

const configuration = {
  start_website: process.env.WEBSTIE_URL as string,
  login_site: process.env.LOGIN_URL as string,
  data_page: process.env.DATA_PAGE as string,
  user: process.env.USER as string,
  password: process.env.PASSWORD as string,
};

export default configuration;
