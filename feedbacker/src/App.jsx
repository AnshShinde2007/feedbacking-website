import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Image,
  ToggleButton,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//to show the time passed
const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
    { label: 'second', secs: 1 },
  ];

  for (let i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'now';
};

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [darkMode, setDarkMode] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await API.get('/');
      setFeedbacks(res.data);
    } catch {
      toast.error('Failed to get the feedbacks.');
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
    } catch {
      toast.error('Failed to submit the feedback.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('sure you want to delete this feedback?')) {
      try {
        await API.delete(`/${id}`);
        toast.info('Feedback has been deleted.');
        fetchFeedbacks();
      } catch {
        toast.error('Failed to delete the feedback.');
      }
    }
  };

  const bg = darkMode ? '#121212' : '#f7f8fa';
  const cardBg = darkMode ? '#1f1f1f' : '#fff';
  const textColor = darkMode ? '#f0f0f0' : '#000';
  const secondaryText = darkMode ? '#cccccc' : '#555';

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: bg }}>
      <Container
  fluid
  className="d-flex justify-content-center align-items-center flex-column"
  style={{ minHeight: '100vh', padding: '2rem' }}
>
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

  <div className="mb-3 d-flex justify-content-end w-100" style={{ maxWidth: '500px' }}>
    <Form.Check
      type="switch"
      id="dark-mode-switch"
      label="Dark"
      checked={darkMode}
      onChange={() => setDarkMode((prev) => !prev)}
    />
  </div>

  <Card
    className="p-4 shadow-sm border-0 rounded-4 w-100"
    style={{
      maxWidth: '500px',
      backgroundColor: cardBg,
      color: textColor,
    }}
  >
    {/* Centered Heading */}
    <div className="text-center mb-4">
      <h4 className="fw-bold mb-0">Your Feedback is Appreciated</h4>
    </div>
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name (optional)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-3"
                style={{
                  backgroundColor: darkMode ? '#2c2c2c' : '',
                  color: textColor,
                  border: 'none',
                }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={4}
                maxLength={250}
                placeholder="Your required feedback"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="rounded-3"
                style={{
                  backgroundColor: darkMode ? '#2c2c2c' : '',
                  color: textColor,
                  border: 'none',
                }}
              />
            </Form.Group>

            <div className="text-end mb-3">
              <small style={{ color: secondaryText }}>{form.message.length}/250</small>
            </div>

            <Button variant={darkMode ? 'light' : 'primary'} type="submit" className="w-100 rounded-3 fw-semibold">
              Done
            </Button>
          </Form>

          <div className="d-flex flex-column gap-3">
            {feedbacks.map((fb) => (
              <Card
                key={fb._id}
                className="p-3 shadow-sm border-0 rounded-4"
                style={{
                  backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                  color: textColor,
                }}
              >
                <Row>
                  <Col xs={2} className="d-flex align-items-center justify-content-center">
                    <Image
                      src={`https://ui-avatars.com/api/?name=${fb.name || 'Anonymous'}&background=888&color=fff&rounded=true`}
                      roundedCircle
                      width={40}
                      height={40}
                      alt="Avatar"
                    />
                  </Col>
                  <Col xs={10}>
                    <h6 className="mb-1 fw-semibold">{fb.name || 'Anonymous'}</h6>
                    <small className="d-block mb-2" style={{ fontSize: '0.8rem', color: secondaryText }}>
                      {timeAgo(fb.createdAt)}
                    </small>
                    <p className="mb-1" style={{ color: secondaryText }}>{fb.message}</p>
                    <Button
                      variant={darkMode ? 'outline-light' : 'outline-danger'}
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
    </div>
  );
}

export default App;
