"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  getKeyValue,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import axiosHttp from "../../utils/axiosConfig";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isUserUpdated, setIsUserUpdated] = useState(false);
  const roles = [
    { value: "admin", id: 1 },
    { value: "user", id: 2 },
  ];

  useEffect(() => {
    getUsers();
    getPosts();
  }, []);

  function getUsers() {
    axiosHttp
      .get("/api/users")
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  }

  function getPosts() {
    axiosHttp
      .get("/api/posts")
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  }
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
              <PencilSquareIcon
                className="cursor-pointer w-5 h-5"
                onClick={() => {
                  setIsOpen(true);
                  setUser(user);
                  console.log(user);
                }}
              />
            </Tooltip>
            <Spacer x={1} />
            <Tooltip content="Delete user" color="danger">
              <TrashIcon
                className="cursor-pointer w-5 h-5 text-red-500"
                onClick={() => {
                  axiosHttp
                    .delete(`/api/users/${user.id}`)
                    .then((response) => {
                      toast.success(response.data.message);
                      getUsers();
                    })
                    .catch((error) => {
                      toast.error(error.response.data.error);
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <span className="text-xl font-bold">Edit User</span>
          </ModalHeader>
          <ModalBody>
            <Input
              readOnly={true}
              label="Email"
              value={user.email}
              onValueChange={(value) =>
                setUser((prev) => ({ ...prev, email: value }))
              }
            />
            <Select
              label="Role"
              defaultSelectedKeys={[user.role]}
              onSelectionChange={(keys) => {
                const userRoleUpdated =
                  keys.values().next().value !== user.role && keys.size === 1;
                if (userRoleUpdated) {
                  setIsUserUpdated(userRoleUpdated);
                  setUser((prev) => ({
                    ...prev,
                    role: keys.values().next().value,
                  }));
                }
              }}
            >
              {roles.map((role) => (
                <SelectItem key={role.value}>{role.value}</SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              isDisabled={!isUserUpdated}
              color="primary"
              onClick={() => {
                axiosHttp
                  .patch(`/api/users/${user.id}`, {
                    roleId: roles.filter((role) => role.value === user.role)[0]
                      .id,
                  })
                  .then((response) => {
                    toast.success(response.data.message);
                    setIsOpen(false);
                  })
                  .catch((error) => {
                    toast.error(error.response.data.error);
                  });
              }}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
