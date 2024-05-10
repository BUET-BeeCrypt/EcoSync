const repository = require("./repository");
const userRepository = require("../user/repository");

const modules = {};

modules.createPost = async (req, res) => {
  try{
    const { user_id } = req.user;
    const content  = req.body;

    // console.table(content);
    
    // validate content
    requireFields = ["title", "description", "type", "latitude", "longitude"];
    requireFields.forEach(field => {
      if (! content[field]) return res.status(400).json({message: `${field} is required`});
    });

  
    const post = await repository.createPost(user_id, content);
    res.status(201).json(post);
  }catch(err){
    res.status(500).json({message: err.message});
  }
};

modules.getPosts = async (req, res) => {
  // get with pagination
  try{
    const limit = req.query.limit || 500;
    const page = req.query.page || 1;

    const posts = await repository.getPosts(page, limit);
    res.status(200).json(posts);
  }catch(err){
    res.status(500).json({message: err.message});
  }
};

modules.getPostsByType = async (req, res) => {
  try{
    const limit = req.query.limit || 500;
    const page = req.query.page || 1;
    const { type } = req.params;
    const posts = await repository.getPostsByType(type, page, limit);
    res.status(200).json(posts);
  }catch(err){
    res.status(500).json({message: err.message});
  }
};

modules.getPost = async (req, res) => {
  try{
    const { postId } = req.params;
    const post = await repository.getPost(postId);
    res.status(200).json(post);
  }catch(err){
    res.status(500).json({message: err.message});
  }
};

modules.createComment = async (req, res) => {
  try{
    let { user_id } = req.user;
    const { postId } = req.params;
    const { comment, anonymous } = req.body; 
    //console.table(req.body);
    if(!comment) return res.status(400).json({message: "comment is required"});
    
    const post = await repository.getPost(postId);
    if (!anonymous) user_id = null;
    const commentResponse = await repository.createComment(user_id, postId, comment);
    res.status(201).json(commentResponse);
  }catch(err){
    console.log(err);
    res.status(500).json({message: err.message});
  }
};


modules.getComments = async (req, res) => {
  try{
    const limit = req.query.limit || 500;
    const page = req.query.page || 1;
    const { postId } = req.params;
    const comments = await repository.getComments(postId, page, limit);
    res.status(200).json(comments);
  }catch(err){
    res.status(500).json({message: err.message});
  }
};

modules.getComment = async (req, res) => {
  try{
    const { postId, commentId } = req.params;
    const comment = await repository.getComment(postId, commentId);
    res.status(200).json(comment);
  }catch(err){
    res.status(500).json({message: err.message});
  }
}


modules.likePost = async (req, res) => {
  try{
    const { user_id } = req.user;
    const { postId } = req.params;
    const post = await repository.getPost(postId);
    const like = await repository.likePost(user_id, postId);
    res.status(201).json(like);
  }catch(err){
    res.status(500).json({message: err.message});
  }
};

modules.getPostLikes = async (req, res) => {
  try{
    const { postId } = req.params;
    const likes = await repository.getPostLikes(postId);
    res.status(200).json(likes);
  }catch(err){
    res.status(500).json({message: err.message});
  }
};

modules.dislikePost = async (req, res) => {
  try{
    const { user_id } = req.user;
    const { postId } = req.params;
    const post = await repository.getPost(postId);
    await repository.dislikePost(user_id, postId);
    res.status(200).json();
  }catch(err){
    res.status(500).json({message: err.message});
  }
};



module.exports = modules;
