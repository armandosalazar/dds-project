"use client";

import { useEffect, useState } from "react";
import useStore from "../store/store";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spacer,
} from "@nextui-org/react";
import axiosHttp from "../utils/axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { EllipsisHorizontalIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    async function verifySession() {
      const token = useStore.getState().token;
      setIsLogged(token !== undefined);

      if (!token) {
        router.push("/login");
      } else {
        await handleGetPosts();
      }
    }

    verifySession();
  }, []);

  async function handleGetPosts() {
    try {
      const response = await axiosHttp.get("/api/posts");

      setPosts(response.data.posts);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  async function handleCreatePost() {
    try {
      const response = await axiosHttp.post("/api/posts", { content: content });

      toast.success(response.data.message);

      setContent("");
      handleGetPosts();
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  return (
    <main className="container mx-auto">
      <Navbar />
      <Toaster />
      {isLogged && (
        <>
          <Spacer y={4} />
          <Card className="w-1/2 mx-auto">
            <CardHeader>
              <span className="font-bold">Create a post</span>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex">
                <Input
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Spacer x={4} />
                <Button color="primary" onClick={handleCreatePost}>
                  Post
                </Button>
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <span className="text-xs">
                You can share your thoughts with the community.
              </span>
            </CardFooter>
          </Card>
          <Spacer y={4} />
          <section>
            {posts.map((post, index) => (
              <article key={index} className="w-1/2 mx-auto">
                <Card>
                  <CardHeader className="flex justify-between">
                    <span className="font-bold">{post.title}</span>
                    {post.user_id === useStore.getState().id && (
                      <>
                        <Dropdown>
                          <DropdownTrigger>
                            <EllipsisHorizontalIcon className="w-5 h-5 cursor-pointer" />
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Actions">
                            <DropdownItem key="edit">Edit</DropdownItem>
                            <DropdownItem key="delete">Delete</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </>
                    )}
                  </CardHeader>
                  <Divider />
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
