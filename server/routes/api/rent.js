const express = require("express");
const bodyParser = require("body-parser");
const { CREATED, BAD_REQUEST } = require("http-status-codes");

const {
  getRentPayments,
  addRentPayment,
} = require("../../persistence/stores/rent");

const router = new express.Router();

router.route("/")
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
