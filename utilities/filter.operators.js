exports.addSymbleToFiltersOperator=(filters)=>{
  let filterString = JSON.stringify(filters);
  filterString = filterString.replace(/gt|lt|gte|lte/g, (match) => `$${match}`);
  return JSON.parse(filterString);
}