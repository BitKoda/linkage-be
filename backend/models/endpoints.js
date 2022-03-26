const endpoints = require("../../endpoints.json");

const getEndpoints = () => {
  if (endpoints) {
    const endpointsStr = JSON.stringify(endpoints);
    return Promise.resolve(endpointsStr);
  } else {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};

module.exports = getEndpoints;
