const fs = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
  production: true,
  emailjs: {
    serviceId: '${process.env.EMAILJS_SERVICE_ID}',
    templateId: '${process.env.EMAILJS_TEMPLATE_ID}',
    userId: '${process.env.EMAILJS_USER_ID}',
    recipient: '${process.env.EMAILJS_RECIPIENT}'
  }
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`✅ Variables escritas en ${targetPath}`);
});