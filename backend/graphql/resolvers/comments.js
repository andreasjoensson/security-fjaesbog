const checkAuth = require('../../auth/checkAuth')
const pool = require('../../database/db');

module.exports = {
Query:{
async getComments(_, {post_id}){
const getCommentsQuery = await pool.query("SELECT * FROM comments WHERE post_id = $1",[post_id]);
return getCommentsQuery.rows
}


},
Mutation:{
async createComment(_, {post_id,text}, context){
const user = checkAuth(context);
const writeCommentQuery = await pool.query("INSERT INTO comments(user_id,text,post_id,created_at,profilepic,name) VALUES($1,$2,$3,$4,$5,$6) RETURNING * ", [user.user_id, text, post_id, new Date().toISOString().slice(0, 19).replace('T', ' '),user.profilepic,user.name]);
return writeCommentQuery.rows[0]
},
async deleteComment(_, {comment_id}){
const deleteQuery = await pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [comment_id]);
return deleteQuery.rows[0];
}


}

}