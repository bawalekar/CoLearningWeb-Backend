"use strict";
var { LearningConnection, User, UserSkills, Skill} = require("../../models/sequelize"); 
//const UserSkills = require("../../models/UserSkills");
//const Skill = require("../../models/Skill");

const createLearningConnectionRequest = async (user, payload) => {
    try
    {
    let learningConnection = new LearningConnection();
  
    learningConnection.userId = payload.request.userId;
    learningConnection.partnerId = payload.request.partnerId;
    learningConnection.skillId = payload.request.skillId;
    learningConnection.skillFluency = payload.request.skillFluency;
    learningConnection.timeCommitment = payload.request.timeCommitment;
    learningConnection.personalNoteRequest = payload.request.personalNoteRequest;
    learningConnection.actionUserId = user.Id;
    learningConnection.connectionType = payload.request.connectionType;
    learningConnection.connectionStatus = "pending";
    learningConnection.dateOfRequest = Date();
    
      return await learningConnection.save()
    }
    catch(e)
    {
        throw new Error(e.message)
    } 
}

const getLearningConnections = async (user) => {
    try
    {
        let learningConnections = await LearningConnection.findAll({ where: { userId: user.id } })

        return Promise.all(learningConnections.map(async(learningConnection) =>{

          const learner = await User.findOne({ where: { id: learningConnection.userId } });
          const partner = await User.findOne({ where: { id: learningConnection.partnerId } });
          const userSkill = await UserSkills.findOne({ where: { id: learningConnection.skillId } });
          const skill = await Skill.findOne({ where: { id: userSkill.skillId } });

          return {
            "id":  learningConnection.id,
            "mentee": await getUser(learner),
            "mentor": await getUser(partner),
            "actionUserId": learningConnection.actionUserId,
            "creation_date": learningConnection.dateOfRequest,
            "accept_date": learningConnection.acceptanceRejectionDate,
            "state": learningConnection.connectionStatus,
            "notesrequest": learningConnection.personalNoteRequest,
            "notesresponse": learningConnection.personalNoteResponse,
            "skillname": skill.skillname,
            "connectionType": learningConnection.connectionType,
          }
        }));
    }
    catch(e)
    {
        throw new Error(e.message)
    }
}

async function getUser(user)
{
  return {
    "id": user.Id,
    "name": user.firstname + " " + user.lastname,
  };
}

async function getLearningConnectionStatus(status)
{
  switch(status)
  {
    case 0:
      return "Pending";
    case 1:
      return "Accepted";
    case 2:
      return "Rejected";
    default:
      return "Invalid";
  }
}

module.exports = {
  createLearningConnectionRequest,
  getLearningConnections
}
