import React, { useEffect, useState } from "react";
import ManagementPage from "../../components/Management/ManagementPage";
import {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../api/tickets";
import { getUsersByType } from "../../api/users";
import { Link } from "react-router-dom";

const AdminTickets = () => {
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      const employees = await getUsersByType("EMPLOYEE");
      const admins = await getUsersByType("ADMIN");
      const combinedUsers = [...employees, ...admins];
      const uniqueUsers = Array.from(
        new Map(combinedUsers.map((user) => [user.id, user])).values(),
      );

      setAdminUsers(uniqueUsers);
    };

    fetchAdminUsers();
  }, []);

  const columns = [
    { field: "title", headerName: "Title" },
    { field: "status", headerName: "Status" },
    {
      field: "assignedToName",
      headerName: "Assigned To",
      valueGetter: (params) => {
        const assignedUser = adminUsers.find(
          (user) => user.id === params.row.assignedTo,
        );
        return assignedUser
          ? `${assignedUser.firstName} ${assignedUser.lastName}`
          : "Unassigned";
      },
    },
    {
      field: "messagesLink",
      headerName: "Messages",
      renderCell: (params) => (
        <Link to={`/tickets/${params.row.id}/messages`}>View Messages</Link>
      ),
    },
  ];

  const fields = [
    { name: "title", label: "Title", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "OPEN", label: "Open" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "CLOSED", label: "Closed" },
      ],
    },
    {
      name: "assignedTo",
      label: "Assigned To",
      type: "select",
      options: adminUsers.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      })),
    },
  ];

  return (
    <ManagementPage
      title="Ticket"
      columns={columns}
      fields={fields}
      fetchItems={getTickets}
      getItem={getTicket}
      createItem={createTicket}
      updateItem={updateTicket}
      deleteItem={deleteTicket}
    />
  );
};

export default AdminTickets;
