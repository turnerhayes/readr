const express = require("express");
const bodyParser = require("body-parser");
const { CREATED, BAD_REQUEST } = require("http-status-codes");
const parseISO = require("date-fns/parseISO");
const addWeeks = require("date-fns/addWeeks");
const format = require("date-fns/format");

const {
  getRentPayments,
  addRentPayment,
  addRentDates,
} = require("../../persistence/stores/rent");

const router = new express.Router();

router.route("/")
  .post(
    bodyParser.json(),
    async (req, res, next) => {
      const {
        numDates,
        dueAmountPerDate,
        firstRentDate,
        rentPeriod,
      } = req.body;

      if (numDates < 1) {
        const err = new Error("numDates parameter must be greater than 0");
        err.status = BAD_REQUEST;

        return next(err);
      }

      if (!dueAmountPerDate) {
        const err = new Error(
          "dueAmountPerDate parameter must be greater than 0"
        );
        err.status = BAD_REQUEST;

        return next(err);
      }

      if (!firstRentDate) {
        const err = new Error(
          "firstRentDate parameter is required"
        );
        err.status = BAD_REQUEST;

        return next(err);
      }

      try {
        const dates = [];

        let currentDueDate = firstRentDate;

        for (let dateIndex = 0; dateIndex < numDates; dateIndex++) {
          dates.push({
            dueDate: currentDueDate,
            dueAmount: dueAmountPerDate,
          });

          if (dateIndex < numDates - 1) {
            let date = parseISO(currentDueDate);

            if (rentPeriod === "monthly") {
              date.setMonth(date.getMonth() + 1);
            } else if (rentPeriod === "weekly") {
              date = addWeeks(date, 1);
            } else {
              const err = new Error(`Unknown rent period: ${rentPeriod}`);
              err.status = BAD_REQUEST;

              return next(err);
            }

            currentDueDate = format(
              date,
              "yyyy-MM-dd"
            );
          }
        }

        await addRentDates({
          dates,
        });

        res.status(CREATED)
          .location(
            `${req.baseURL}/payments`
          )
          .send();
      } catch (ex) {
        next(ex);
      }
    }
  );

router.route("/payments")
  .get(
    async (req, res, next) => {
      try {
        const rents = await getRentPayments();

        const rentsObject = {};

        for (const rent of rents) {
          rentsObject[rent.dueDate] = rent;
        }

        res.json(rentsObject);
      } catch (ex) {
        next(ex);
      }
    }
  ).post(
    bodyParser.json(),
    async (req, res, next) => {
      const { dueDate, paidAmount, paidDate } = req.body;

      if (!dueDate) {
        const err = new Error("No dueDate parameter");
        err.status = BAD_REQUEST;

        return next(err);
      }

      if (!(paidAmount || paidDate)) {
        const err = new Error(
          "At least one parameter of `paidAmount` and `paidDate` is required"
        );
        err.status = BAD_REQUEST;

        return next(err);
      }

      try {
        await addRentPayment({
          dueDate,
          paidAmount,
          paidDate,
        });

        res.status(CREATED).send();
      } catch (ex) {
        next(ex);
      }
    }
  );

module.exports = router;
