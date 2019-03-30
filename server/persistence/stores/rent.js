const { getDataConnection } = require("../connections");

/**
 * @typedef RentDate
 *
 * @property {string} dueDate the date the rent is due, as a date string
 * @property {number} dueAmount the amount of rent due, in cents
 */

const getRentPayments = async () => {
  const data = await getDataConnection();

  const payments = await data.select({
    id: "rents.id",
    dueAmount: "rents.due_amount",
    dueDate: "rents.due_date",
    payments: data.select(
      data.raw(
        `
          json_agg(
            json_build_object(
              'id', rent_payments.id,
              'paidAmount', rent_payments.paid_amount,
              'paidDate', rent_payments.paid_date
            )
          )
        `
      )
    )
      .from("rent_payments")
      .where({
        "rent_payments.rent_id": data.column("rents.id"),
      }).whereNull("rent_payments.deleted_at"),
  }).from("rents").whereNull(
    "rents.deleted_at"
  ).groupBy(
    "rents.id"
  ).orderBy("rents.due_date", "asc");

  for (const payment of payments) {
    if (payment.paidDates) {
      payment.paidDates = payment.paidDates.filter(
        (date) => date !== null
      );
    }
  }

  return payments;
};

const addRentPayment = async ({
  dueDate,
  paidAmount,
  paidDate,
}) => {
  const data = await getDataConnection();

  return data.insert({
    "rent_id": data.select("id")
      .from("rents")
      .where({
        "due_date": dueDate,
      }),
    "paid_amount": paidAmount,
    "paid_date": paidDate,
  }).into("rent_payments");
};

/**
 * Adds rent dates
 *
 * @param {object} args
 * @param {RentDate[]} args.dates the dates to add
 *
 * @return {Promise<void>}
 */
const addRentDates = async ({ dates }) => {
  const data = await getDataConnection();

  return data.batchInsert(
    "rents",
    dates.map(
      ({ dueDate, dueAmount }) => ({
        "due_date": dueDate,
        "due_amount": dueAmount,
      })
    )
  );
};

module.exports = {
  getRentPayments,
  addRentPayment,
  addRentDates,
};

