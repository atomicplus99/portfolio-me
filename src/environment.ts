declare const process: any;

export const environment = {
  production: false,
  emailjs: {
    serviceId: process.env.EMAILJS_SERVICE_ID,  
    templateId: process.env.EMAILJS_TEMPLATE_ID,
    userId: process.env.EMAILJS_USER_ID,
    recipient: process.env.EMAILJS_RECIPIENT
  }
};

console.log('🔥 Variables cargadas:', environment.emailjs);
console.log('🔥 ServiceId:', environment.emailjs.serviceId);
console.log('🔥 TemplateId:', environment.emailjs.templateId);