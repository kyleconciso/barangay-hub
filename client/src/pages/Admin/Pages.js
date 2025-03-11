import React from "react";
import ManagementPage from "../../components/Management/ManagementPage";
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
} from "../../api/pages";

const AdminPages = () => {
  const columns = [
    { field: "title", headerName: "Title" },
    { field: "slug", headerName: "Slug" },
    { field: "createdAt", headerName: "Created At" },
  ];

  const fields = [
    { name: "title", label: "Title", type: "text" },
    { name: "slug", label: "Slug", type: "text" },
    { name: "content", label: "Content", type: "richtext" },
    { name: "imageURL", label: "Image URL", type: "uri" },
  ];

  return (
    <ManagementPage
      title="Page"
      columns={columns}
      fields={fields}
      fetchItems={getPages}
      getItem={getPage}
      createItem={createPage}
      updateItem={updatePage}
      deleteItem={deletePage}
    />
  );
};

export default AdminPages;
