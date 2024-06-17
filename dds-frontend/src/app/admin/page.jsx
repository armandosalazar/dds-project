"use client";
import {
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import axiosHttp from "../../utils/axiosConfig";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    function getUsers() {
      axiosHttp
        .get("/api/users")
        .then((response) => {
          setUsers(response.data.users);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    function getPosts() {
      axiosHttp
        .get("/api/posts")
        .then((response) => {
          setPosts(response.data.posts);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    getUsers();
    getPosts();
  }, []);

  const userColumns = [
    { key: "id", label: "ID" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions" },
  ];

  const renderCellUser = React.useCallback((user, columnKey) => {
    switch (columnKey) {
      case "id":
        return user.id;
      case "email":
        return user.email;
      case "role":
        return user.role;
      case "actions":
        return (
          <div className="flex">
            <Tooltip content="Edit user">
              <PencilSquareIcon className="cursor-pointer w-5 h-5" />
            </Tooltip>
            <Spacer x={1} />
            <Tooltip content="Delete user" color="danger">
              <TrashIcon
                className="cursor-pointer w-5 h-5 text-red-500"
                onClick={() => {
                  console.log(user.id);
                  axiosHttp
                    .delete(`/api/users/${user.id}`)
                    .then((response) => {
                      console.log(response.data.message);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }}
              />
            </Tooltip>
          </div>
        );
    }
  }, []);

  return (
    <section className="w-1/2 mx-auto">
      <Spacer y={2} />
      <article>
        <Table aria-label="Users">
          <TableHeader columns={userColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCellUser(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </article>
      <article></article>
    </section>
  );
}
