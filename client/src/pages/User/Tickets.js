import React from "react";
import ManagementPage from "../../components/Management/ManagementPage";
import * as ticketsApi from "../../api/tickets";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const UserTickets = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>You must be logged in to view your tickets.</div>;
  }

  const ticketFields = [
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
      options: [],
    },
    { name: "createdAt", label: "Created At", type: "text", readOnly: true },
  ];

  const columns = [
    { field: "title", headerName: "Title" },
    { field: "status", headerName: "Status" },
    {
      field: "messagesLink",
      headerName: "Messages",
      renderCell: (params) => (
        <Link to={`/tickets/${params.row.id}/messages`}>View Messages</Link>
      ),
    },
  ];

  // custom fetch function to get only the user's tickets
  const fetchUserTickets = () =>
    ticketsApi.getTickets().then((tickets) => {
      return tickets.filter((ticket) => ticket.createdBy === user.uid);
    });

  return (
    <ManagementPage
      title="My Tickets"
      columns={columns}
      fields={ticketFields}
      fetchItems={fetchUserTickets}
      getItem={ticketsApi.getTicket}
      createItem={ticketsApi.createTicket}
      updateItem={ticketsApi.updateTicket}
      deleteItem={ticketsApi.deleteTicket}
    />
  );
};

export default UserTickets;
