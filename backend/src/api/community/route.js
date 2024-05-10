const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

router.post("/post", controller.createPost);
router.get("/post", controller.getPosts);
// get all post of a type
router.get("/post/type/:type", controller.getPostsByType);
// get all posts for dncc
// type is 'all' for all types
router.get("/post/dncc/:type", controller.getPostsForDNCC);
router.get("/post/:postId", controller.getPost);
router.post("/post/:postId/comment", controller.createComment);
router.get("/post/:postId/comment", controller.getComments);
router.get("/post/:postId/comment/:commentId", controller.getComment)
// like posts
router.get("/post/:postId/like", controller.likePost);
router.get("/post/:postId/likes", controller.getPostLikes);
// dislike post
router.delete("/post/:postId/like", controller.dislikePost);


module.exports = router;