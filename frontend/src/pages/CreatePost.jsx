import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import storage from "../appwriteConfig";
import { ID } from "appwrite";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { token } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  // console.log(user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [postFile, setPostFile] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [postFileError, setPostFileError] = useState("");
  const [postFileUrl, setPostFileUrl] = useState("");
  const formSubmitHandler = async (e) => {
    setPostFileError("");
    e.preventDefault();
    // console.log(title, content, category, postFile);
    const resp = await fetch("http://localhost:3000/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, category, image: postFileUrl }),
    });
    const data = await resp.json();
    if (data.message) {
      setPostFileError(data.message);
      return;
    }
    if (data) {
      // console.log(data);
      navigate(`/post/${data.slug}`);
    }
  };
  const uploadImageHandler = () => {
    try {
      if (!postFile) {
        return setPostFileError("Please select a file!");
      }
      setPostFileError("");
      setUploadingFile(true);
      const uploadFile = storage.createFile(
        "661e51d9dbd8d135aae1",
        ID.unique(),
        postFile
      );
      uploadFile.then((resp) => {
        if (resp) {
          // console.log(resp);
          const fileUrl = storage.getFilePreview(
            "661e51d9dbd8d135aae1",
            resp.$id
          );
          // console.log(fileUrl);
          setPostFileUrl(fileUrl);
          setUploadingFile(false);
        }
      });
    } catch (error) {
      setPostFileError(error.message);
      setUploadingFile(false);
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={formSubmitHandler}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id='title'
            className='flex-1'
          />
          <Select
            name='category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={"uncategorized"}>Select a category</option>
            <option value='javascript'>Javascript</option>
            <option value='reactjs'>React js</option>
            <option value='nextjs'>Next js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setPostFile(e.target.files[0])}
          />
          <Button
            className=''
            type='button'
            gradientDuoTone={"purpleToBlue"}
            outline
            size={"sm"}
            disabled={uploadingFile}
            onClick={uploadImageHandler}
          >
            Upload Image
          </Button>
        </div>
        <div>
          {postFileError && <Alert color={"failure"}>{postFileError}</Alert>}
          {uploadingFile && <Alert color={"info"}>Uploading File...</Alert>}
        </div>
        {postFileUrl && (
          <img
            src={postFileUrl}
            alt='post image'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          required
          className='h-72 mb-12'
          name='content'
          value={content}
          onChange={setContent}
        />
        <Button
          type='submit'
          disabled={uploadingFile}
          gradientDuoTone={"purpleToPink"}
        >
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
