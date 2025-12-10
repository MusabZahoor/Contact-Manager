import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  CardHeader,
  CardBody,
  Badge,
  Modal
} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/contacts/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/contacts', formData);
      }
      setFormData({ name: '', email: '', phone: '', address: '' });
      setEditingId(null);
      fetchContacts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving contact:', error);
      setError('Failed to save contact');
    }
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setEditingId(contact._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
        setError('Failed to delete contact');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingId(null);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Contact Manager</h2>

      {/* Add New Contact Card */}
      <Card className="mb-5 shadow" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <CardHeader className="bg-secondary text-white text-center">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {editingId ? 'Edit Contact' : 'Add New Contact'}
          </h4>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Full Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Email *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Phone *
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                    Address *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    required
                  />
                </Form.Group>

                <div className="text-center">
                  <Button variant={editingId ? "warning" : "success"} type="submit" size="lg">
                    <FontAwesomeIcon icon={editingId ? faSave : faPlus} className="me-2" />
                    {editingId ? 'Update Contact' : 'Add Contact'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* Contacts List */}
      <h3 className="mb-4">Contact List</h3>
      <Row xs={1} md={2} lg={3} className="g-4">
        {contacts.map((contact) => (
          <Col key={contact._id}>
            <Card className="h-100 shadow">
              <CardHeader className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{contact.name}</h5>
                  <div className="d-flex gap-1">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleEdit(contact)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(contact._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                  {contact.email}
                </p>
                <p className="mb-2">
                  <FontAwesomeIcon icon={faPhone} className="me-2 text-muted" />
                  {contact.phone}
                </p>
                <p className="mb-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-muted" />
                  {contact.address}
                </p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Error Alert */}
      {error && (
        <div className="mt-3 alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </Container>
  );
};

export default Contacts;