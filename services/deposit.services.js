const Deposit = require("../models/deposit.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");

exports.addNewDepositService = async (deposit) => {
  const result = await Deposit.create(deposit);
  return result;
};

exports.getAllPendingDepositService = async (query) => {
  let { limit, sort, page, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);
  filters.status = "pending";

  const result = await Deposit.find(filters)
    .skip(limit * page)
    .limit(limit)
    .sort(sort);
  return result;
};
