import { Alert, Button, TextInput, Spinner, Modal } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUser,
} from "../store/userSlice";

const DashProfile = () => {
  const { user, loading, token, error } = useSelector(
    (state) => state.userReducer
  );
  // console.log(token);
  const navigate = useNavigate();
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: () => user.username,
    email: () => user.email,
    password: () => user.password,
    photoUrl: () => user.photoUrl,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const formSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      dispatch(updateUserStart());
      setUserUpdateSuccess(null);
      // console.log(document.cookie);
      const resp = await fetch(
        `http://localhost:3000/user/update/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );
      const data = await resp.json();
      if (data.error) {
        dispatch(updateUserFailure(data.error));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUserUpdateSuccess("User's Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const deleteUserHandler = async () => {
    // setShowModal(true);
    dispatch(deleteUserStart());
    try {
      const resp = await fetch(
        `http://localhost:3000/user/delete/${user._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await resp.json();
      dispatch(deleteUserSuccess());
      setDeleteSuccess(data);
      navigate("/sign-up");
    } catch (error) {
      setShowModal(false);
      dispatch(deleteUserFailure(data.error));
      console.log(error);
    }
  };
  const signOutUserHandler = () => {
    dispatch(signOutUser());
    // console.log("hello world");
  };
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={formSubmit}>
        <div className='w-32 h-32 self-center cursor-pointer shadow-md over rounded-full'>
          <img
            src={user.photoUrl}
            alt='user icon'
            className='rounded-full w-full h-full border-8 border-gray-400 object-cover'
          />
        </div>
        <TextInput
          type='text'
          id='username'
          placeholder='Username'
          name='username'
          defaultValue={user.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='Email'
          name='email'
          defaultValue={user.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          disabled={loading}
          gradientDuoTone={"purpleToBlue"}
          outline
        >
          {loading ? (
            <>
              <Spinner size={"sm"} />
              <span className='pt-3'>Loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
        {user.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type='button'
              gradientDuoTone={"purpleToPink"}
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className='cursor-pointer' onClick={signOutUserHandler}>
          Sign Out
        </span>
      </div>
      {userUpdateSuccess && (
        <Alert color={"success"} className='mt-5'>
          {userUpdateSuccess}
        </Alert>
      )}
      {deleteSuccess && (
        <Alert color={"success"} className='mt-5'>
          {deleteSuccess}
        </Alert>
      )}
      {error ? (
        <Alert color={"failure"} className='mt-5'>
          <span>{error}</span>
        </Alert>
      ) : (
        ""
      )}
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
                  Are you sure you want to delete your account?
                </h3>
                <div className='flex items-center justify-between'>
                  <Button color={"failure"} onClick={deleteUserHandler}>
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
    </div>
  );
};

export default DashProfile;
