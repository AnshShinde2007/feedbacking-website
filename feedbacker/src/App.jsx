/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/');
      setFeedbacks(res.data);
     
    } catch (err) {
      toast.error('Failed to fetch feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;

    try {
      await API.post('/', form);
      toast.success('Feedback submitted!');
      setForm({ name: '', message: '' });
      fetchFeedbacks();
    } catch (err) {
      toast.error('Failed to submit feedback.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this feedback?')) {
      try {
        await API.delete(`/${id}`);
        toast.info('Feedback deleted.');
        fetchFeedbacks();
      } catch (err) {
        toast.error('Failed to delete feedback.');
      }
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 1000); // in seconds

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diff < 60) return rtf.format(-diff, 'second');
    if (diff < 3600) return rtf.format(-Math.floor(diff / 60), 'minute');
    if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), 'hour');
    if (diff < 604800) return rtf.format(-Math.floor(diff / 86400), 'day');
    if (diff < 2419200) return rtf.format(-Math.floor(diff / 604800), 'week');
    return rtf.format(-Math.floor(diff / 2592000), 'month');
  };

  return (
    <Container className="d-flex justify-content-center align-items-start py-5" style={{ minHeight: '100vh', backgroundColor: '#f7f8fa' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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

          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-3 fw-semibold"
            disabled={!form.message.trim()}
          >
            Submit
          </Button>
        </Form>

        {loading ? (
          <div className="text-center text-muted">Loading...</div>
        ) : (
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
                      {getRelativeTime(fb.createdAt)}
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
        )}
      </Card>
    </Container>
  );
}

export default App;
