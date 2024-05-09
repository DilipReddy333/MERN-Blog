import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Table, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(false);
  const [message, setMessage] = useState({
    color: "",
    msgBody: "",
  });
  const [showMore, setShowMore] = useState(true);
  useEffect(() => {
    const getAllPosts = async () => {
      const resp = await fetch(
        `http://localhost:3000/post/getPosts?userId=${user._id}`,
        { method: "GET" }
      );
      const data = await resp.json();
      if (data.allPosts.length < 6) {
        setShowMore(false);
      }
      setPosts(data.allPosts);
    };
    if (user.isAdmin) {
      return () => {
        getAllPosts();
      };
    }
  }, [user._id]);
  const showMoreHandler = async () => {
    const startIndex = posts.length;
    try {
      const data = await fetch(
        `http://localhost:3000/post/getPosts?userId=${user._id}&startIndex=${startIndex}`
      );
      const { allPosts } = await data.json();
      // console.log(remainingPosts);
      if (allPosts.length < 6) {
        setShowMore(false);
      }
      setPosts((prevPosts) => {
        return [...prevPosts, ...allPosts];
      });
      // console.log(allPosts);
    } catch (error) {
      console.log(error.message);
    }
  };
  const deletePost = async (postId) => {
    try {
      const resp = await fetch(`http://localhost:3000/post/deletePost`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await resp.json();
      if (data.message) {
        setMessage({ color: "failure", msgBody: data.message });
      }
      if (data) {
        const filteredPosts = posts.filter((post) => post._id !== data._id);
        setPosts(filteredPosts);
        setShowModal(false);
        setMessage({
          color: "success",
          msgBody: `${data.title} Post deleted successfully!`,
        });
      }
    } catch (error) {
      setMessage({ color: "failure", msgBody: error.message });
    }
  };
  return (
    <>
      <div className='table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {user.isAdmin && posts.length > 0 ? (
          <>
            {message?.msgBody && (
              <Alert
                onDismiss={() => {
                  setMessage({ color: "", msgBody: "" });
                }}
                className='mt-5 mb-3'
                color={"success"}
              >
                {message.msgBody}
              </Alert>
            )}
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category </Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {posts.map((post, i) => {
                return (
                  <Table.Body className='divide-y' key={i}>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleDateString("en-GB")}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/dashboard/post/${post.slug}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className='w-20 h-10 object-cover bg-gray-500'
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className='font-medium text-gray-900 dark:text-white'
                          to={`/dashboard/post/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setPostToDelete(post._id);
                            setShowModal(true);
                          }}
                          className='font-medium text-red-500 hover:underline cursor-pointer'
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className='text-teal-500 hover:underline'
                          to={`/update-post/${post._id}`}
                        >
                          Edit
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })}
            </Table>
            {showMore && (
              <div className='flex items-center justify-center mx-auto mt-5'>
                <Button onClick={showMoreHandler} className='' outline>
                  Show More
                </Button>
              </div>
            )}
          </>
        ) : (
          <p> You have no Posts yet</p>
        )}
      </div>
      {showModal &&
        createPortal(
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size={"md"}
          >
            <Modal.Header />
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                  Are you sure you want to delete the post?
                </h3>
                <div className='flex items-center justify-between'>
                  <Button
                    color={"failure"}
                    onClick={() => deletePost(postToDelete)}
                  >
                    Yes, I'm sure
                  </Button>
                  <Button color={"gray"} onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>,
          document.getElementById("modal")
        )}
    </>
  );
};

export default DashPosts;
