import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Table, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const AllUsers = () => {
  const { user, token } = useSelector((state) => state.userReducer);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(false);
  const [message, setMessage] = useState({
    color: "",
    msgBody: "",
  });
  const [showMore, setShowMore] = useState(true);
  useEffect(() => {
    const getAllUsers = async () => {
      const resp = await fetch(`http://localhost:3000/user/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json();
      //   console.log(data);
      if (data.users.length < 6) {
        setShowMore(false);
      }
      setUsers(data.users);
    };
    if (user.isAdmin) {
      return () => {
        getAllUsers();
      };
    }
  }, [user._id]);
  const showMoreHandler = async () => {
    const startIndex = users.length;
    try {
      const data = await fetch(`http://localhost:3000/user/`);
      const { users } = await data.json();
      // console.log(remainingPosts);
      if (users.length < 6) {
        setShowMore(false);
      }
      setUsers((prevUsers) => {
        return [...prevUsers, ...users];
      });
      // console.log(allPosts);
    } catch (error) {
      console.log(error.message);
    }
  };
  const deleteUser = async () => {
    // console.log(userToDelete);
    try {
      const resp = await fetch(
        `http://localhost:3000/user/delete/${userToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await resp.json();
      if (data) {
        // console.log(data);
        const filteredUsers = users.filter((user) => {
          return user._id !== data._id;
        });
        setUsers(filteredUsers);
        setShowModal(false);
        setMessage({ color: "success", msgBody: "User deleted successfully!" });
      }
    } catch (error) {
      setShowModal(false);
      console.log(error);
      setMessage({ color: "failure", msgBody: error.message });
    }
  };
  return (
    <>
      <div className='table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {user.isAdmin && users.length > 0 ? (
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
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>User Profile</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email </Table.HeadCell>
                <Table.HeadCell>Admin </Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {users.map((user, i) => {
                return (
                  <Table.Body className='divide-y' key={i}>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </Table.Cell>
                      <Table.Cell>
                        <img
                          src={user.photoUrl}
                          alt={user.username}
                          className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        {user.isAdmin ? (
                          <FaCheck className='text-green-500 text-lg' />
                        ) : (
                          <FaTimes className='text-red-500 text-lg' />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setUserToDelete(user._id);
                            setShowModal(true);
                          }}
                          className='font-medium text-red-500 hover:underline cursor-pointer'
                        >
                          Delete
                        </span>
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
          <p> You have no Users yet</p>
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
                  Are you sure you want to delete the user?
                </h3>
                <div className='flex items-center justify-between'>
                  <Button color={"failure"} onClick={deleteUser}>
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

export default AllUsers;
