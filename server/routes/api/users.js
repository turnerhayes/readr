const express = require("express");

const {
  getUsers,
} = require("../../persistence/stores/user");

const router = new express.Router();

router.route("/")
  .get(
    async (req, res, next) => {
      let {
        ids,
      } = req.query;

      if (ids && !Array.isArray(ids)) {
        ids = [ids];
      }

      try {
        const users = await getUsers({
          ids,
        });

        res.json(users);
      } catch (ex) {
        next(ex);
      }
    }
  );

module.exports = router;
