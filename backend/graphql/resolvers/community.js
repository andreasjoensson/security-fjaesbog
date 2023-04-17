const checkAuth = require('../../auth/checkAuth');
const db = require('../../database/db');

module.exports ={
Query:{
async getCommunity(_,{name}){
const getCommunityQuery = await db.query("SELECT * FROM community WHERE name = $1", [name]);
const getAmountOfMembers = await db.query("SELECT COUNT(*) FROM members WHERE community_id = $1", [getCommunityQuery.rows[0].id]);

return {
    ...getCommunityQuery.rows[0],
    members: getAmountOfMembers.rows[0].count
};
},
async getCommunityPosts(_,{name}){
const getCommunityID = await db.query("SELECT id FROM community WHERE name = $1", [name]);
const posts = await db.query("SELECT * FROM posts WHERE community_id = $1", [getCommunityID.rows[0].id]);
return posts.rows;
},
async getCommunityMembers(_, {name}){
const getCommunityID = await db.query("SELECT id FROM community where name = $1",[name]);
const members = await db.query("SELECT users_id FROM members WHERE community_id = $1", [getCommunityID.rows[0].id]);
return members.rows;
}
},
Mutation:{
async createCommunity(_, {name, description, profilepic, coverpic}, context){
    console.log("kører")
const user = checkAuth(context);
const createQuery = await db.query("INSERT INTO community(name, description, created_at, creator_id, profilepic, coverpic)  VALUES($1,$2,$3,$4,$5,$6) RETURNING *", [name,description,new Date().toISOString().slice(0, 19).replace('T', ' '), user.user_id,profilepic,coverpic])
return createQuery.rows[0]
},
async addMember(_, {community_id}, context){
const user = checkAuth(context);
const getMembers = await db.query("SELECT * FROM members WHERE community_id = $1",[community_id]);

if(getMembers.rows.filter(row => row.users_id == user.user_id).length > 0){
console.log("user is already member, so unfollow member from community");
const removeMember = await db.query("DELETE FROM members WHERE community_id =$1 AND users_id = $2 RETURNING*",[community_id, user.user_id]);
return removeMember.rows[0]
}

const addMember = await db.query("INSERT INTO members(community_id, users_id) VALUES($1,$2) RETURNING *", [community_id, user.user_id])

return addMember.rows[0]
},

}
}