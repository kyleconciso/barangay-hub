import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ManagementList from "./ManagementList";
import ManagementForm from "./ManagementForm";
import ManagementDetail from "./ManagementDetail";

// helper function to safely process api data
const sanitizeData = (data) => {
  if (!data) return data;

  // if it's an array, process each item
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // if it's an object, process each property
  if (typeof data === "object") {
    const result = { ...data };

    // process each property
    Object.keys(result).forEach((key) => {
      const value = result[key];

      // handle firestore timestamps
      if (value && typeof value === "object") {
        if ("_seconds" in value && "_nanoseconds" in value) {
          // convert to date
          result[key] = new Date(value._seconds * 1000);
        } else if (Object.keys(value).length === 0) {
          // handle empty objects
          result[key] = "";
        } else {
          // recursively sanitize nested objects
          result[key] = sanitizeData(value);
        }
      }
    });

    return result;
  }

  // return primitives as is
  return data;
};

const ManagementPage = ({
  title,
  columns,
  fields,
  fetchItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'

  // fetch all items when component mounts
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchItems();
        // sanitize the response data to handle timestamp objects
        const sanitizedData = sanitizeData(data);
        setItems(sanitizedData);
        setError(null);
      } catch (err) {
        setError(`Failed to load ${title.toLowerCase()}s: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [fetchItems, title]);

  const handleCreateClick = () => {
    setSelectedItem(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEditClick = async (id) => {
    try {
      const item = await getItem(id);
      // sanitize the item data
      const sanitizedItem = sanitizeData(item);
      setSelectedItem(sanitizedItem);
      setFormMode("edit");
      setIsFormOpen(true);
    } catch (err) {
      setError(`Failed to get ${title.toLowerCase()} details: ${err.message}`);
    }
  };

  const handleDetailClick = async (id) => {
    try {
      const item = await getItem(id);
      // sanitize the item data
      const sanitizedItem = sanitizeData(item);
      setSelectedItem(sanitizedItem);
      setIsDetailOpen(true);
    } catch (err) {
      setError(`Failed to get ${title.toLowerCase()} details: ${err.message}`);
    }
  };

  const handleDeleteClick = async (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${title.toLowerCase()}?`,
      )
    ) {
      try {
        await deleteItem(id);
        setItems(items.filter((item) => item.id !== id));
      } catch (err) {
        setError(`Failed to delete ${title.toLowerCase()}: ${err.message}`);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;

      if (formMode === "create") {
        result = await createItem(formData);
        // sanitize the returned data
        const sanitizedResult = sanitizeData(result);
        setItems([...items, sanitizedResult]);
      } else {
        result = await updateItem(selectedItem.id, formData);
        // sanitize the returned data
        const sanitizedResult = sanitizeData(result);
        setItems(
          items.map((item) =>
            item.id === sanitizedResult.id ? sanitizedResult : item,
          ),
        );
      }
      setIsFormOpen(false);
      return true;
    } catch (err) {
      setError(`Failed to ${formMode} ${title.toLowerCase()}: ${err.message}`);
      return false; // return false to prevent form from closing
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            {title} Management
          </Typography>
          {createItem && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              Create {title}
            </Button>
          )}
        </Box>

        {error && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "error.light",
              color: "error.contrastText",
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        )}

        <ManagementList
          columns={columns}
          items={items}
          loading={loading}
          onEditClick={handleEditClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
        />

        <ManagementForm
          title={title}
          fields={fields}
          open={isFormOpen}
          mode={formMode}
          initialData={selectedItem}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />

        <ManagementDetail
          title={title}
          fields={fields}
          open={isDetailOpen}
          item={selectedItem}
          onClose={handleDetailClose}
          onEditClick={() => {
            setIsDetailOpen(false);
            setFormMode("edit");
            setIsFormOpen(true);
          }}
        />
      </Box>
    </Container>
  );
};

export default ManagementPage;
