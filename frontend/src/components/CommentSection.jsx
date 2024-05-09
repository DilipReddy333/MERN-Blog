import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { user, token } = useSelector((user) => user.userReducer);
  const [postComments, setPostComments] = useState([]);
  const [error, setError] = useState({
    color: "",
    msg: "",
  });
  useEffect(() => {
    const getAllComments = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/comment/${postId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const allComments = await resp.json();
        // console.log(allComments);
        if (allComments.length > 0) {
          setPostComments(allComments);
        }
      } catch (error) {
        setError({ color: "failure", msg: error.message });
      }
    };
    return () => {
      getAllComments();
    };
  }, [postId]);
  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (comment.length > 200) {
        setError({
          color: "failure",
          msg: "Comment is greater than 200 characters",
        });
        return;
      }
      setError({ color: "", msg: "" });
      const resp = await fetch(`http://localhost:3000/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, userId: user._id }),
      });
      const data = await resp.json();
      if (data) {
        setComment("");
        setPostComments((prev) => [data.createdComment, ...prev]);
        // console.log(data.createdComment);
      }
    } catch (error) {
      setError({ color: "failure", msg: error.message });
    }
  };
  const handleLike = async (commentId) => {
    // console.log(commentId);
    try {
      if (!user) {
        <Navigate to={"/sign-in"} />;
      }
      const resp = await fetch(`http://localhost:3000/comment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json();
      if (data) {
        // console.log(data);
        const updatedComments = postComments.map((cmt) => {
          if (cmt._id === data._id) {
            return {
              ...cmt,
              likes: data.likes,
              numberOfLikes: data.numberOfLikes,
            };
          } else {
            return cmt;
          }
        });
        setPostComments(updatedComments);
      }
    } catch (error) {
      setError({ color: "failure", msg: error.message });
    }
  };
  const deleteCommentHandler = async (commentId) => {
    // console.log(commentId);
    try {
      const resp = await fetch(`http://localhost:3000/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json();
      if (data) {
        // console.log(data);
        const updatedComments = postComments.filter((cmt) => {
          return cmt._id !== commentId;
        });
        setPostComments(updatedComments);
      }
    } catch (error) {
      setError({ color: "failure", msg: error.message });
    }
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {user ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as :</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={user.photoUrl}
            alt={user.username}
          />
          <Link
            className='text-xs text-cyan-600 hover:underline'
            to={"/dashboard?tab=profile"}
          >
            @{user.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment,
          <Link className='text-blue-500 hover:underline' to='/sign-in'>
            Sign In
          </Link>
        </div>
      )}
      {user && (
        <form
          onSubmit={commentSubmitHandler}
          className='border border-teal-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a Comment'
            required
            rows={3}
            maxLength={"200"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-sm'>
              {comment.length === 0 ? "200" : 200 - comment.length} characters
              remaining
            </p>
            <Button
              className=''
              outline
              gradientDuoTone={"purpleToBlue"}
              type='submit'
            >
              Submit
            </Button>
          </div>
          {error.msg && (
            <Alert className='mt-5' color={error.color}>
              {error.msg}
            </Alert>
          )}
        </form>
      )}
      {postComments.length === 0 ? (
        <>
          <p className='text-sm my-5'>No Comments yet!</p>
        </>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-500 py-1 px-2 rounded-sm'>
              <p>{postComments.length}</p>
            </div>
          </div>
          {postComments.map((comment, i) => {
            return (
              <Comment
                comment={comment}
                key={i}
                onLike={handleLike}
                onDelete={deleteCommentHandler}
                postComments={postComments}
                setPostComments={setPostComments}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default CommentSection;
