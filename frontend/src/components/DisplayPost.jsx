import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import CallToAction from "./CallToAction";

const DisplayPost = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState("");
  const { user } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPost = async () => {
      try {
        const resp = await fetch(
          `http://localhost:3000/post/getPosts?userId=${user._id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await resp.json();
        setPost(data.allPosts[0]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    return () => {
      getPost();
    };
  }, [postSlug]);
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner />
      </div>
    );
  }
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='mt-10 p-3 text-3xl text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post?.title}
      </h1>
      <Link
        className='self-center mt-5'
        to={`/search?category=${post?.category}`}
      >
        <Button className='' color={"gray"} pill size={"xs"}>
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex items-center justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>
          {post && new Date(post.createdAt).toLocaleDateString("en-GB")}
        </span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0) < 0
            ? "Quick post"
            : "mins read"}
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full '>
        <CallToAction />
      </div>
    </main>
  );
};

export default DisplayPost;
