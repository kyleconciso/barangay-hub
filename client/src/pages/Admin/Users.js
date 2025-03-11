import React from "react";
import ManagementPage from "../../components/Management/ManagementPage";
import { getUsers, getUser, updateUser, deleteUser } from "../../api/users"; // no createuser

const AdminUsers = () => {
  const columns = [
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    { field: "type", headerName: "Type" },
    { field: "role", headerName: "Role" },
  ];

  const fields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "address", label: "Address", type: "textarea" },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "RESIDENT", label: "Resident" },
        { value: "EMPLOYEE", label: "Employee" },
        { value: "ADMIN", label: "Admin" },
      ],
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "", label: "None" },
        { value: "CAPTAIN", label: "Captain" },
        { value: "SECRETARY", label: "Secretary" },
        { value: "TREASURER", label: "Treasurer" },
        { value: "COUNCILOR", label: "Councilor" },
        { value: "SK_CHAIRPERSON", label: "SK Chairperson" },
        { value: "SK_MEMBER", label: "SK Member" },
      ],
    },
    { name: "bio", label: "Bio", type: "textarea" },
  ];

  return (
    <ManagementPage
      title="User"
      columns={columns}
      fields={fields}
      fetchItems={getUsers}
      getItem={getUser}
      createItem={() => {}} // no create user functionality
      updateItem={updateUser}
      deleteItem={deleteUser}
    />
  );
};

export default AdminUsers;
