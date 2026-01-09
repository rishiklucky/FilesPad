import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { createSpace, loginSpace } from '../services/api';

const Login = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (!code) return;
            await loginSpace(code);
            localStorage.setItem('spaceCode', code);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleCreate = async () => {
        try {
            if (!code) {
                inputRef.current?.focus();
                setError("Please enter a name for your new space below");
                return;
            }
            const res = await createSpace(code);
            const newCode = res.data.code;
            localStorage.setItem('spaceCode', newCode);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create space');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center flex-grow-1">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <div className="glass-card text-center">
                        <h1 className="mb-4 fw-bold">FilesPad</h1>
                        <p className="text-secondary mb-4">Secure, temporary file sharing.</p>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleLogin} className="mb-4">
                            <Form.Group className="mb-3">
                                <Form.Control
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Enter Space Name"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="text-center fw-bold fs-5"
                                    maxLength={20}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 btn-custom py-2 fw-bold"
                                disabled={!code}
                            >
                                Join Space
                            </Button>
                        </Form>

                        <div className="d-flex align-items-center mb-4">
                            <div className="flex-grow-1 border-bottom border-secondary opacity-25"></div>
                            <span className="mx-3 text-secondary small">OR</span>
                            <div className="flex-grow-1 border-bottom border-secondary opacity-25"></div>
                        </div>

                        <Button
                            variant="outline-light"
                            className="w-100 btn-custom py-2"
                            onClick={handleCreate}
                        >
                            Create Space '{code || '...'}'
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
