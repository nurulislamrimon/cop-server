const Member = require("../models/member.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");


exports.getAllAdminService=async(query)=>{
    let {limit,page,sort,...filters}=query;
    filters=addSymbleToFiltersOperator(filters)
    filters.role="admin"
    const result = await Member.find(filters)
    .skip(page*limit)
    .limit(limit)
    .sort(sort);
    return result
}

exports.addNewAdminService=async(id)=>{
    const result=await Member.findByIdAndUpdate(id,{$set:{role:"admin"}})
return result
}

exports.deleteAnAdminService=async(id)=>{
    const result=await Member.findByIdAndUpdate(id,{$set:{role:"general-member"}})
    return result
}