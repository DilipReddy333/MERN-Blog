import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({
  comment,
  onLike,
  onDelete,
  postComments,
  setPostComments,
}) => {
  // console.log(comment);
  const { user, token } = useSelector((state) => state.userReducer);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const editCommentHandler = async (commentId) => {
    // console.log(commentId);
    try {
      if (editedContent.trim().length === 0) {
        alert("Please give the comment!");
        return;
      }
      const resp = await fetch(
        `http://localhost:3000/comment/edit/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: editedContent }),
        }
      );
      const data = await resp.json();
      if (data) {
        // console.log(data);
        const updatedComments = postComments.map((cmt) => {
          if (cmt._id === data._id) {
            return { ...cmt, comment: data.comment };
          } else {
            return cmt;
          }
        });
        setPostComments(updatedComments);
        setEditedContent("");
        setEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200 object-cover'
          src={comment?.userId?.photoUrl}
          alt='user profile image'
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {comment?.userId?.username
              ? `@${comment.userId.username}`
              : "anonymous user"}
          </span>
          <span className='text-gray-500 text-xs'>
            {new Date(comment?.createdAt).toLocaleDateString("en-GB")}
          </span>
        </div>
        {editing ? (
          <>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex items-center gap-1 mt-2 mb-2 flex-row-reverse'>
              <Button
                gradientDuoTone={"purpleToPink"}
                onClick={() => setEditing(false)}
                outline
              >
                Cancel
              </Button>
              <Button
                gradientDuoTone={"purpleToPink"}
                onClick={() => {
                  editCommentHandler(comment._id);
                }}
              >
                Save
              </Button>
            </div>
          </>
        ) : (
          <p className='text-gray-500 mb-2'>{comment?.comment}</p>
        )}
        <div className='flex items-center gap-2'>
          <button
            className={`text-gray-400 hover:text-blue-500 ${
              user && comment.likes.includes(user._id) && "!text-blue-500"
            }`}
            type='button'
            onClick={() => onLike(comment._id)}
          >
            <FaThumbsUp className='text-sm' />
          </button>
          <p className='text-gray-500'>
            {comment.numberOfLikes > 1
              ? `${comment.numberOfLikes} Likes`
              : `${comment.numberOfLikes} Like`}
          </p>
          {comment.userId._id === user._id || user.isAdmin ? (
            <>
              <p
                className='text-gray-500 cursor-pointer hover:text-blue-500'
                onClick={() => {
                  setEditing(true);
                  setEditedContent(comment.comment);
                }}
              >
                Edit
              </p>
              <p
                className='text-gray-500 cursor-pointer hover:text-red-500'
                onClick={() => onDelete(comment._id)}
              >
                Delete
              </p>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
