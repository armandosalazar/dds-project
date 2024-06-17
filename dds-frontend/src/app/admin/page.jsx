"use client";
import {
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import axiosHttp from "../../utils/axiosConfig";

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
              <TableRow key={item.ID}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "CreatedAt" || columnKey === "UpdatedAt"
                      ? new Date(getKeyValue(item, columnKey)).toLocaleString()
                      : columnKey === "roleId"
                      ? getKeyValue(item, columnKey) === 1
                        ? "Admin"
                        : "User"
                      : getKeyValue(item, columnKey)}
                  </TableCell>
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
