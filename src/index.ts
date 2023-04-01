import { evaluateFoodlocatios, extractTableData, startApp } from './app/app';
import { email_configuration } from './config/configuration';
import { emailTransporter } from './nodemailer/config/startConfiguration';

const email: Email = {
  from: email_configuration.user,
  to: email_configuration.recipient,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
};

async function sendEmail(email: Email) {
  console.log(email);

  emailTransporter.sendMail(email, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

async function run() {
  const distributionPage = await startApp();

  const turnedOn = 1;

  while (turnedOn == 1) {
    const tableData = await extractTableData(distributionPage);

    const evaluatedTableData = await evaluateFoodlocatios(tableData);

    if (evaluatedTableData.length > 0) {
      var message: string = '';

      evaluatedTableData.forEach((location) => {
        var info = `Laikas: ${location.dateTime},\n
        Laisvos vietos: ${location.empty},\n
        Vieta: ${location.location},\n
        Padejejas: ${location.helper},\n
        Didelis kiekis: ${location.isBigAmount},\n
        Papildomas savaitei: ${location.extraDistribution}\n `;

        message += info;
      });

      const email: Email = {
        from: email_configuration.user,
        to: email_configuration.recipient,
        subject: `yra ${evaluatedTableData.length} nauju vietu`,
        text: message,
      };

      sendEmail(email);
    }
    await delay(60000);

    await distributionPage.reload({ waitUntil: 'domcontentloaded' });
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run();
