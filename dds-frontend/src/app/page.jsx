"use client";

import { useEffect, useState } from "react";
import useStore from "../store/store";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
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
import Navbar from "@/app/components/Navbar";
import {
  CommandLineIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/app/components/Sidebar";

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
      } else {
        handleGetPosts();
      }
    }

    verifySession();
  }, []);

  function handleGetPosts() {
    axiosHttp
      .get("/api/posts")
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  }

  function handleCreatePost() {
    axiosHttp
      .post("/api/posts", { content: content })
      .then((response) => {
        toast.success(response.data.message);
        setContent("");
        handleGetPosts();
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  }

  return (
    <main className="flex flex-col h-screen">
      <Navbar />
      <Toaster position="top-right" />
      <section className="flex flex-1">
        <Sidebar />
        {isLogged && (
          <article className="w-full">
            <Card className="m-4">
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreatePost();
                      }
                    }}
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
            <section>
              {posts.map((post, index) => (
                <article key={index} className="m-4">
                  <Card>
                    <CardHeader className="flex justify-between">
                      <Chip
                        color={post.userId > 0 ? "success" : "danger"}
                        size="sm"
                        variant="flat"
                      >
                        {post.userId > 0 ? "Active" : "Inactive"}
                      </Chip>
                      <span className="font-bold">{post.title}</span>
                      {post.title === useStore.getState().email ? (
                        <section>
                          <Dropdown>
                            <DropdownTrigger>
                              <EllipsisHorizontalIcon className="w-5 h-5 cursor-pointer" />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Actions">
                              <DropdownItem key="edit">Edit</DropdownItem>
                              <DropdownItem key="delete">Delete</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </section>
                      ) : (
                        <section></section>
                      )}
                    </CardHeader>
                    <Divider />
                    <CardBody>{post.content}</CardBody>
                    <Divider />
                    <CardFooter>
                      <span className="text-xs">
                        <CommandLineIcon className="w-4 h-4" />
                      </span>
                    </CardFooter>
                  </Card>
                  <Spacer y={2} />
                </article>
              ))}
            </section>
          </article>
        )}
      </section>
    </main>
  );
}
