import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import CallToAction from "./CallToAction";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";

const DisplayPost = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState(null);
  useEffect(() => {
    const getPost = async () => {
      try {
        const resp = await fetch(
          `http://localhost:3000/post/getPosts?slug=${postSlug}`,
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
    getPost();
  }, [postSlug]);
  // console.log(post);
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/post/getPosts?limit=3`);
        const data = await resp.json();
        if (resp.ok) {
          setRecentPosts(data.allPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    return () => {
      fetchRecentPosts();
    };
  }, []);
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
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full '>
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='tet-xl mt-5'>Recent Articles</h1>
        <div className='flex flex-wrap gap-3 mb-5 justify-center'>
          {recentPosts?.length > 0 &&
            recentPosts?.map((post, i) => {
              return <PostCard key={i} post={post} />;
            })}
        </div>
      </div>
    </main>
  );
};

export default DisplayPost;
