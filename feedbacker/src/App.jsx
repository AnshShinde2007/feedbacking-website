import { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './api';

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });

  const fetchFeedbacks = async () => {
    const res = await API.get('/');
    setFeedbacks(res.data);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    await API.post('/', form);
    setForm({ name: '', message: '' });
    fetchFeedbacks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this feedback?')) {
      await API.delete(`/${id}`);
      fetchFeedbacks();
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-start py-5" style={{ minHeight: '100vh', backgroundColor: '#f7f8fa' }}>
      <Card className="p-4 shadow-sm border-0 rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h4 className="text-center fw-bold mb-4">📝 Anonymous Feedback</h4>

        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-3"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={250}
              placeholder="Your feedback... (required)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="rounded-3"
            />
          </Form.Group>

          <div className="text-end mb-3">
            <small className="text-muted">{form.message.length}/250</small>
          </div>

          <Button variant="primary" type="submit" className="w-100 rounded-3 fw-semibold">
            Submit
          </Button>
        </Form>

        <div className="d-flex flex-column gap-3">
          {feedbacks.map((fb) => (
            <Card key={fb._id} className="p-3 shadow-sm border-0 rounded-4 bg-white">
              <Row>
                <Col xs={2} className="d-flex align-items-center justify-content-center">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${fb.name || 'Anonymous'}&background=eee&color=333&rounded=true`}
                    roundedCircle
                    width={40}
                    height={40}
                    alt="Avatar"
                  />
                </Col>
                <Col>
                  <h6 className="mb-1 fw-semibold">{fb.name || 'Anonymous'}</h6>
                  <small className="text-muted d-block mb-2" style={{ fontSize: '0.8rem' }}>
                    {new Date(fb.createdAt).toLocaleString()}
                  </small>
                  <p className="mb-1 text-secondary">{fb.message}</p>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(fb._id)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </Card>
    </Container>
  );
}

export default App;
