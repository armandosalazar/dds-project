"use client";

import { useEffect, useState } from "react";
import useStore from "../store/store";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Spacer,
} from "@nextui-org/react";
import axiosHttp from "../utils/axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    function verifySession() {
      const token = useStore.getState().token;
      setIsLogged(token !== undefined);

      if (!token) {
        router.push("/login");
      }
    }

    verifySession();
    handleGetPosts();
  }, []);

  async function handleGetPosts() {
    try {
      const response = await axiosHttp.get("/api/posts");

      setPosts(response.data.posts);
    } catch (error) {
      toast.error(error.response.data.error);
      // toast.error("An error occurred while fetching the posts.");
      console.error(error);
    }
  }

  async function handleCreatePost() {
    try {
      const response = await axiosHttp.post("/api/posts", { content: content });

      toast.success(response.data.message);

      setContent("");
      handleGetPosts();
    } catch (error) {
      // toast.error("An error occurred while creating the post.");
      // console.error(error);
      toast.error(error.response.data.error);
    }
  }

  return (
    <main className="container mx-auto">
      <Navbar />
      <Toaster />
      {isLogged && (
        <>
          <section className="w-1/2 mx-auto">
            <Spacer y={4} />
            <article className="flex items-center">
              <Input
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Spacer x={4} />
              <Button color="primary" onClick={handleCreatePost}>
                Post
              </Button>
            </article>
            <Spacer y={4} />
          </section>
          <section>
            {posts.map((post, index) => (
              <article key={index}>
                <Card>
                  {/* <CardHeader>{post.user.email}</CardHeader> */}
                  <CardBody>{post.content}</CardBody>
                </Card>
                <Spacer y={2} />
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
