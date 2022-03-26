const getEndpoints = require("../models/endpoints");

const getEndpointsController = (req, res, next) => {
  getEndpoints()
    .then((response) => {
      const endpoints = JSON.parse(response);
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getEndpointsController;
