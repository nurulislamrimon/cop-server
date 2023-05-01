exports.addSymbleToFiltersOperator = (filters) => {
  if (filters.name) {
    filters.name = { $regex: filters.name, $options: "i" };
  }
  let filterString = JSON.stringify(filters);
  filterString = filterString.replace(/gt|lt|gte|lte/g, (match) => `$${match}`);
  return JSON.parse(filterString);
};
