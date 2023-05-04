const mongoose = require("mongoose");
const Business = require("../models/business.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const { ObjectId } = mongoose.Types;

exports.getAllBusinessService = async (query) => {
  let { limit, page, sort, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Business.find(filters)
    .skip(page * limit)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.addNewBusinesservice = async (business) => {
  const result = await Business.create(business);
  return result;
};

exports.getBusinessByIdService = async (id) => {
  const result = await Business.findById(id);
  return result;
};

exports.updateBusinessInfoService = async (businessId, newData) => {
  const result = await Business.updateOne(
    { _id: businessId },
    { $set: newData },
    { runValidators: true }
  );
  return result;
};

exports.deleteAbusinesservice = async (id) => {
  const result = await Business.deleteOne({ _id: new ObjectId(id) });
  return result;
};
