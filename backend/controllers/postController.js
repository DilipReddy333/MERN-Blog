const postModel = require("../Models/postModel");

const createPost = async (req, res) => {
  // console.log(req.user);
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not allowed to create a post" });
  }
  if (!req.body.title || !req.body.content) {
    return res
      .status(403)
      .json({ message: "Please provide all required fields" });
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  try {
    const newPost = await postModel.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category ? req.body.category : "Uncategorized",
      image: req.body.image
        ? req.body.image
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUr7wYZW0Zs2NQ-uTZWCp1e8CjO3sqyD_WUWW8BB4Nuw&s",
      slug,
      userId: req.user.id,
    });
    if (newPost) {
      // console.log(newPost);
      res.status(201).json(newPost);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    // console.log(req.query);
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 6;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const allPosts = await postModel
      .find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: "i" } },
            { content: { $regex: req.query.searchTerm, $options: "i" } },
          ],
        }),
      })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await postModel.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await postModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      allPosts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const postToUpdate = await postModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    if (postToUpdate) {
      res.status(200).json(postToUpdate);
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const deletedPost = await postModel.findByIdAndDelete({ _id: postId });
    if (deletePost) {
      res.status(200).json(deletedPost);
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
