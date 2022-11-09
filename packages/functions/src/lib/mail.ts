// @ts-ignore
import mailgunJS from 'mailgun-js';
import * as functions from 'firebase-functions';

interface sendMailOptions {
  subject: string;
  body: string;
}

function createMailer(): (options: sendMailOptions) => Promise<unknown> {
  const { mailgun: cfg } = functions.config();
  const mailgun = mailgunJS({ apiKey: cfg.api_key, domain: cfg.domain });

  return function sendMail({ subject, body }) {
    return mailgun.messages().send({
      from: `"Cicumikuji Notifier" <postmaster@${cfg.domain}>`,
      to: cfg.recipient,
      subject,
      html: body,
    });
  };
}

export { createMailer };
