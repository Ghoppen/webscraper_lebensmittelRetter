# webscraper_lebensmittelRetter
A simple webscraper to check for new information and send email with updated information

Application is written in TS and node js. In order to start application first run:

`npm install`

After that compile ts to js with:

`tsc`

Finnaly start application with:

`npm start`

Application uses following modules:

* puppeteer to imitate browser
* cheerio for html parsing 
* nodemailer for sending emails

Application will not work if `.env` with required parameters is not created.
For example:
```
WEBSTIE_URL=some url
LOGIN_URL=some url
DATA_PAGE=some url
USER=username used to login to website
PASSWORD=password for user
MAIL_USER=email used to send an email
MAIL_PASSWORD=password to that email
MAIL_RECIPIENT=recipient of information
```
