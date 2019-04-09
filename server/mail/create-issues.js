const TurndownService = require("turndown");

const {
  getUnprocessedMail,
  markMessagesProcessed,
} = require("./get-pending");

const turndownService = new TurndownService()
  .remove(["script", "style", "title"]);

const createIssuesFromMail = async () => {
  let unprocessed = await getUnprocessedMail();

  if (unprocessed.length === 0) {
    return [];
  }

  const { getIssues, createIssue } = require("../persistence/stores/issues");

  const existingIssues = await getIssues({
    originMessageIDs: unprocessed.map(
      (email) => email.messageId
    ),
  });

  const existingIssueMessageIDs = new Set(
    existingIssues.map(
      (issue) => issue.originMessageID
    )
  );

  unprocessed = unprocessed.filter(
    (email) => !existingIssueMessageIDs.has(email.messageId)
  );

  if (unprocessed.length === 0) {
    return [];
  }

  const issues = await Promise.all(
    unprocessed.map(
      (email) => {
        const {
          subject,
          html,
          messageId,
          from: {
            value: [
              {
                address: from,
              },
            ],
          },
        } = email;

        const markdown = turndownService.turndown(html);

        return createIssue({
          creatorText: from,
          issueData: {
            description: subject,
            body: markdown,
            originMessageID: messageId,
          },
        });
      }
    )
  );

  await markMessagesProcessed(
    unprocessed.map(
      (email) => email.uid
    )
  );

  return issues;
};

module.exports = {
  createIssuesFromMail,
};
