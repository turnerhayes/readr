const { promisify } = require("util");
const simpleParser = require("mailparser").simpleParser;
const Imap = require("imap");
const debug = require("debug")("fief:server:mail:get-pending");

const Config = require("../config");
const { PROCESSED_LABEL } = require("./constants");

/**
 * Connects to the IMAP server
 *
 * @return {Promise<Imap>} the connection object
 */
const connect = async () => {
  const imap = new Imap({
    user: Config.mail.imap.username,
    password: Config.mail.imap.password,
    host: Config.mail.imap.host,
    port: Config.mail.imap.port,
    tls: Config.mail.imap.useTLS,
    debug,
  });

  const readyPromise = new Promise(
    (resolve, reject) => {
      imap.once(
        "ready",
        () => resolve(imap)
      );

      imap.once(
        "error",
        reject
      );
    }
  );

  imap.connect();

  await readyPromise;

  await promisify(imap.openBox.bind(imap))("INBOX");

  return imap;
};

/**
 * @type {Promise<Imap>}
 */
let connectionPromise;

/**
 * Returns a promise that resolves with the connection object
 *
 * @return {Promise<Imap>}
 */
const getConnectionPromise = () => {
  if (!connectionPromise) {
    connectionPromise = connect();
  }

  return connectionPromise;
};

const findUnprocessedEmails = async () => {
  const imap = await getConnectionPromise();

  return promisify(imap.search.bind(imap))(
    [
      [
        "!X-GM-LABELS",
        PROCESSED_LABEL,
      ],
    ]
  );
};

const getEmails = async (uids) => {
  const imap = await getConnectionPromise();

  const f = imap.fetch(uids, {
    bodies: "",
    struct: true,
  });

  const promises = [];

  await new Promise(
    (resolve, reject) => {
      f.on("message", (msg, uid) => {
        const bodyPromise = new Promise(
          (resolve) => {
            msg.once("body", async (stream, info) => {
              const email = await simpleParser(stream);

              resolve(email);
            });
          }
        );

        const attributesPromise = new Promise(
          (resolve) => {
            msg.once("attributes", (attributes) => {
              resolve(attributes);
            });
          }
        );

        promises.push(
          Promise.all([
            bodyPromise,
            attributesPromise,
          ]).then(
            ([email, attributes]) => {
              email.attributes = attributes;

              email.uid = email.attributes.uid;

              return email;
            }
          )
        );
      });

      f.once("error", (err) => {
        reject(err);
      });

      f.once("end", () => {
        resolve();
      });
    }
  );

  return Promise.all(promises);
};

const getUnprocessedMail = async () => {
  const uids = await findUnprocessedEmails();

  if (uids.length === 0) {
    return [];
  }

  return getEmails(uids);
};

const markMessagesProcessed = async (uids) => {
  const imap = await getConnectionPromise();

  await promisify(imap.addLabels.bind(imap))(
    uids,
    PROCESSED_LABEL
  );

  await promisify(imap.addFlags.bind(imap))(
    uids,
    "\\Seen"
  );
};

const closeConnection = async () => {
  if (!connectionPromise) {
    return;
  }

  const imap = await connectionPromise;

  await promisify(imap.closeBox.bind(imap))();

  imap.end();

  connectionPromise = undefined;
};

module.exports = {
  getUnprocessedMail,
  markMessagesProcessed,
  closeConnection,
};
