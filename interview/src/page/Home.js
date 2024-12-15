import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Home = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    _id: '',
    name: '',
    type: '',
    price: '',
    rating: '',
    warranty_years: '',
    available: false,
  });
  const [editingItem, setEditingItem] = useState(null);

  // Fetch items from API
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/items')
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission for create or update
  const handleSubmit = (e) => {
    e.preventDefault();
    const apiEndpoint = editingItem
      ? `http://localhost:5000/api/items/${editingItem._id}`
      : 'http://localhost:5000/api/items';
    const httpMethod = editingItem ? axios.put : axios.post;

    httpMethod(apiEndpoint, newItem)
      .then((response) => {
        if (editingItem) {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item._id === response.data._id ? response.data : item
            )
          );
        } else {
          setItems((prevItems) => [...prevItems, response.data]);
        }
        setNewItem({
          _id: '',
          name: '',
          type: '',
          price: '',
          rating: '',
          warranty_years: '',
          available: false,
        });
        setEditingItem(null);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });
  };

  // Handle delete item
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/items/${id}`)
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  // Handle edit item
  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({ ...item });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Articl
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            {editingItem ? 'Modifier un Article' : 'Ajouter un Nouvel Article'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom"
                fullWidth
                value={newItem.name}
                onChange={handleChange}
                name="name"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Type"
                fullWidth
                value={newItem.type}
                onChange={handleChange}
                name="type"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prix (€)"
                fullWidth
                value={newItem.price}
                onChange={handleChange}
                name="price"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Évaluation"
                fullWidth
                value={newItem.rating}
                onChange={handleChange}
                name="rating"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Années de Garantie"
                fullWidth
                value={newItem.warranty_years}
                onChange={handleChange}
                name="warranty_years"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newItem.available}
                    onChange={handleChange}
                    name="available"
                  />
                }
                label="Disponible"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            {editingItem ? 'Modifier' : 'Ajouter'}
          </Button>
        </form>
      </Paper>

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">Type : {item.type}</Typography>
                <Typography variant="body1">Prix : {item.price} €</Typography>
                <Typography variant="body1">
                  Évaluation : {item.rating}
                </Typography>
                <Typography variant="body1">
                  Garantie : {item.warranty_years} ans
                </Typography>
                <Typography variant="body1">
                  Disponible : {item.available ? 'Oui' : 'Non'}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(item)}
                    color="primary"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(item._id)}
                    startIcon={<DeleteIcon />}
                  >
                    Supprimer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Proptype validation
Home.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  price: PropTypes.number,
  rating: PropTypes.number,
  warranty_years: PropTypes.number,
  available: PropTypes.bool,
};

export default Home;
