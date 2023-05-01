const Committee = require("../models/committee.model");
const committeeServices = require("../services/committee.services");
const { getMemberByIdService } = require("../services/members.services");

exports.addNewCommitteeController = async (req, res, next) => {
  try {
    if (!req.body.members) {
      throw new Error("Please make sure you have provide valid data!");
    } else if(!req.body.members[0]?.id||!req.body.members[0]?.role) {
      throw new Error("Please provide member id and role!")
    }else{      
      const result = await committeeServices.addNewCommitteeService(req.body);
      res.send({
        status: "success",
        data: result,
      });
      console.log("New committee added!");
    }
  } catch (error) {
    next(error);
  }
};

exports.updateCommitteeAddMemberController=async(req,res,next)=>{
  try {
    if (!req.body.id||!req.body.role) {
      throw new Error("Please provide member id and role!")
    }else{
    const member=await getMemberByIdService(req.body.id);
    if (!member) {
      throw new Error("Member not found!")
    }else{
    const existCommittee =await committeeServices.getActiveCommittee(); 
for (const existMember of existCommittee?.members) {
  if (existMember.memberCopID===member.memberCopID) {
    throw new Error("This member is already in the active committee!")
}
}
    const result = await committeeServices.updateCommitteeAddMemberService(member,req.body.role);
res.send({
  status:"success",
  data:result
})    
console.log(`${result}`);}}
  } catch (error) {
    next(error)
  }
}

exports.deleteACommitteeController=async(req,res,next)=>{
  try {
    const committeeId = req.params.committeeId
    const result = await committeeServices.deleteACommitteeService(committeeId)
    res.send({
      status:"success",
      data:result
    })
    console.log(result);
  } catch (error) {
    next(error)
  }
}

exports.getActiveCommitteeController=async(req,res,next)=>{
  try {
    const result = await committeeServices.getActiveCommittee();
    res.send({
      status:"success",
      data:result
    })
    console.log(`Active committee ${result._id} is responsed!`);
    return result
  } catch (error) {
    next(error)
  }
}

exports.getAllCommitteeController=async(req,res,next)=>{
  try {
    const result = await committeeServices.getAllCommitteeService(req.query)
    res.send({
      status:"success",
      data:result
    })
    console.log(`Committee ${result.length} is responsed!`);
  } catch (error) {
    next(error)
  }
}