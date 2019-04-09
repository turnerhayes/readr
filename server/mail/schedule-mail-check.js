const schedule = require("node-schedule");
const debug = require("debug")("fief:server:schedule-mail-check");

const { closeConnection } = require("./get-pending");
const { createIssuesFromMail } = require("./create-issues");

const startSchedule = () => {
  return schedule.scheduleJob(
    "Check for issue emails",
    "*/3 * * * *",
    async () => {
      const issues = await createIssuesFromMail();

      debug("Issues from emails: ", issues);

      await closeConnection();
    }
  );
};

module.exports = {
  startSchedule,
};
