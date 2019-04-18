const {
  FIEF_MAIL_IMAP_HOST: host,
  FIEF_MAIL_IMAP_PORT: port,
  FIEF_MAIL_IMAP_USERNAME: username,
  FIEF_MAIL_IMAP_PASSWORD: password,
  FIEF_MAIL_IMAP_USE_TLS: useTLS,
} = process.env;

const MailConfig = {
  imap: {
    enabled: Boolean(host),
    host,
    port,
    username,
    password,
    useTLS: Boolean(useTLS),
  },
};

module.exports = MailConfig;
