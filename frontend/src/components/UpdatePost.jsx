import { useParams } from "react-router-dom";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import storage from "../appwriteConfig";
import { ID } from "appwrite";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [postToUpdate, setPostToUpdate] = useState({});
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [inputFile, setInputFile] = useState("");
  const { token } = useSelector((state) => state.userReducer);
  const [alertMsg, setAlertMsg] = useState({
    color: "",
    msg: "",
  });
  useEffect(() => {
    const getPostWithId = async () => {
      const resp = await fetch(
        `http://localhost:3000/post/getPosts?postId=${postId}`
      );
      const { allPosts } = await resp.json();
      //   console.log(allPosts[0]);
      const post = allPosts[0];
      setPostToUpdate(post);
      setUpdatedTitle(() => post?.title);
      setUpdatedCategory(() => post?.category);
      setUpdatedContent(() => post?.content);
      setUpdatedImage(() => post?.image);
    };
    return () => {
      getPostWithId();
    };
  }, [postId]);
  // console.log(postToUpdate);
  const replacePostImage = async () => {
    try {
      setAlertMsg({ color: "info", msg: "Deleting previous post image" });
      const imageId = postToUpdate.image.split("/")[8];
      if (imageId) {
        await storage.deleteFile("661e51d9dbd8d135aae1", imageId);
      }
      // if (!imageId) {
      //   setAlertMsg({
      //     color: "failure",
      //     msg: "Image ID not found, could not replace image",
      //   });
      //   return;
      // }
      setAlertMsg({ color: "info", msg: "Uploading new post image" });
      const uploadFile = storage.createFile(
        "661e51d9dbd8d135aae1",
        ID.unique(),
        inputFile
      );
      uploadFile.then((resp) => {
        if (resp) {
          const fileUrl = storage.getFilePreview(
            "661e51d9dbd8d135aae1",
            resp.$id
          );
          // console.log(fileUrl);
          // setUpdatedPostUrl(fileUrl);
          setUpdatedImage(fileUrl);
          setAlertMsg({
            color: "success",
            msg: "Post image replaced successfully, you can close this alert to update the post",
          });
        }
      });
    } catch (error) {
      setAlertMsg({ color: "failure", msg: error.message });
    }
  };
  const postUpdateHandler = async (e) => {
    e.preventDefault();
    // console.log(updatedTitle, updatedContent, updatedCategory, updatedImage);
    const resp = await fetch(
      `http://localhost:3000/post/updatePost/${postToUpdate._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent,
          category: updatedCategory,
          image: updatedImage,
        }),
      }
    );
    const data = await resp.json();
    if (data.message) {
      setAlertMsg({ color: "failure", msg: data.message });
    }
    navigate("/dashboard?tab=posts");
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Update post {postToUpdate?.title}
      </h1>
      <form className='flex flex-col gap-4' onSubmit={postUpdateHandler}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            id='title'
            className='flex-1'
          />
          <Select
            name='category'
            value={updatedCategory}
            onChange={(e) => setUpdatedCategory(e.target.value)}
          >
            <option value={"uncategorized"}>Select a category</option>
            <option value='javascript'>Javascript</option>
            <option value='reactjs'>React js</option>
            <option value='nextjs'>Next js</option>
          </Select>
        </div>
        <FileInput
          type='file'
          accept='image/*'
          ref={fileRef}
          onChange={(e) => setInputFile(e.target.files[0])}
          className='hidden'
        />
        {/* <Button
            className=''
            type='button'
            gradientDuoTone={"purpleToBlue"}
            outline
            size={"sm"}
          >
            Upload Image
          </Button> */}
        {/* <div>
          {postFileError && <Alert color={"failure"}>{postFileError}</Alert>}
          {uploadingFile && <Alert color={"info"}>Uploading File...</Alert>}
        </div> */}
        {updatedImage && (
          <>
            <div className='relative flex items-center justify-center'>
              <img
                src={updatedImage}
                alt='post image'
                className='w-full h-72 object-cover opacity-30'
              />
              <Button
                className='flex flex-row mx-auto absolute '
                gradientDuoTone={"purpleToBlue"}
                onClick={() => fileRef.current.click()}
                disabled={alertMsg.msg ? true : false}
                outline
              >
                Update Image
              </Button>
            </div>
            {inputFile && (
              <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <img
                  src={URL.createObjectURL(inputFile)}
                  className='w-20 h-12'
                />
                <Button
                  type='button'
                  disabled={alertMsg.msg ? true : false}
                  onClick={replacePostImage}
                >
                  Upload
                </Button>
              </div>
            )}
          </>
        )}
        {alertMsg.msg && (
          <Alert
            onDismiss={
              alertMsg.msg ===
              "Post image replaced successfully, you can close this alert to update the post"
                ? () => setAlertMsg({ color: "", alertMsg: "" })
                : ""
            }
            className='mt-2 mb-2'
            color={alertMsg.color}
          >
            {alertMsg.msg}
          </Alert>
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          required
          className='h-72 mb-12'
          value={updatedContent}
          onChange={setUpdatedContent}
          name='content'
        />
        <Button
          type='submit'
          disabled={alertMsg.msg ? true : false}
          gradientDuoTone={"purpleToPink"}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
