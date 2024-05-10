const pool = require(`../../db/pool`);

const modules = {};
/*
-- comment on post
-- post_id, user_id, comment, timestamp
CREATE TABLE public."Comment" (
    "comment_id" SERIAL PRIMARY KEY,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER, -- can be anonymous null for anonymous post
    "comment" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL
);

-- like on post
-- post_id, user_id, timestamp
CREATE TABLE public."Like" (
    "like_id" SERIAL PRIMARY KEY,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP NOT NULL
);
*/

// create post
modules.createPost = async (user_id, post) => {
  try {
    //console.table(post)
    const {title, description, type, issue_type, image_uri, visibility, latitude, longitude } = post;
    const query = `INSERT INTO public."Post" 
    (user_id, title, description, type, type_value, image_uri, visibility, latitude, longitude, timestamp) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    
    const values = [user_id, title, description, type, issue_type, image_uri, visibility, latitude, longitude, new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  } 
};

// get posts
modules.getPosts = async (page, limit) => {
  try {
    const query = `SELECT *,
    (SELECT COUNT(*) FROM public."Like" WHERE public."Like".post_id = public."Post".post_id)::INTEGER as likes
    FROM public."Post"
    WHERE visibility != 'DNCC'
    ORDER BY timestamp DESC LIMIT $1 OFFSET $2`;
    const values = [limit, (page - 1) * limit];
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

// get posts by type
modules.getPostsByType = async (type, page, limit) => {
  try {
    const query = `SELECT *,
    (SELECT COUNT(*) FROM public."Like" WHERE public."Like".post_id = public."Post".post_id)::INTEGER as likes
    FROM public."Post" WHERE type = $1 AND visibility != 'DNCC'
    ORDER BY timestamp DESC LIMIT $2 OFFSET $3`;
    const values = [type, limit, (page - 1) * limit];
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

// get post for dncc
modules.getPostsForDNCC = async (type, page, limit) => {
  try {

    let  query = `SELECT *,
    (SELECT COUNT(*) FROM public."Like" WHERE public."Like".post_id = public."Post".post_id)::INTEGER as likes
    FROM public."Post"
    WHERE visibility = 'DNCC' AND type = $1
    ORDER BY timestamp DESC LIMIT $2 OFFSET $3`;

    let values = [type, limit, (page - 1) * limit];

    if(type === 'all'){
      query = `SELECT *,
      (SELECT COUNT(*) FROM public."Like" WHERE public."Like".post_id = public."Post".post_id)::INTEGER as likes
      FROM public."Post"
      WHERE visibility = 'DNCC'
      ORDER BY timestamp DESC LIMIT $1 OFFSET $2`;

      values = [limit, (page - 1) * limit];
    }

  
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  }
}

// get a post
modules.getPost = async (postId) => {
  try {
    const query = `SELECT *,
    (SELECT COUNT(*) FROM public."Like" WHERE public."Like".post_id = public."Post".post_id)::INTEGER as likes
    FROM public."Post" WHERE post_id = $1`;
    const values = [postId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// create comment
modules.createComment = async (user_id, post_id,comment) => {
  try {
    const query = `INSERT INTO public."Comment" 
    (user_id, post_id, comment, timestamp) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [user_id, post_id, comment, new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// get comments of a post
modules.getComments = async (postId, page, limit) => {
  try {
    const query = `SELECT * FROM public."Comment" 
    WHERE post_id = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3`;
    const values = [postId, limit, (page - 1) * limit];
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

// like post
modules.likePost = async (user_id, post_id) => {
  try {
    const query = `INSERT INTO public."Like" 
    (user_id, post_id, timestamp) 
    VALUES ($1, $2, $3) RETURNING *`;
    const values = [user_id, post_id, new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// dislike post
modules.dislikePost = async (user_id, post_id) => {
  try {
    const query = `DELETE FROM public."Like" WHERE user_id = $1 AND post_id = $2`;
    const values = [user_id, post_id];
    await pool.query(query, values);
    return { message: "Post disliked" };
  } catch (error) {
    throw error;
  }
};

module.exports = modules;

