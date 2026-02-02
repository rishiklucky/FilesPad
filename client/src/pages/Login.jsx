import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { createSpace, loginSpace } from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                <Col md={8} lg={6} xl={4}>
                    <div className="glass-card text-center">
                        <h1 className="mb-4 fw-bold">FilesPad</h1>
                        <p className="text-secondary mb-4">Secure, temporary file sharing.</p>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleLogin} className="mb-4">
                            <Form.Group className="mb-3">
                                <InputGroup>
                                    <Form.Control
                                        ref={inputRef}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Space Name"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        className="bg-transparent text-center fw-bold fs-5 shadow-none-focus custom-placeholder"
                                        maxLength={20}
                                        style={{ borderRight: 'none' }}
                                        autoComplete="off"
                                    />
                                    <InputGroup.Text
                                        className="bg-transparent border-start-0"
                                        style={{
                                            cursor: 'pointer',
                                            border: '3px solid #000000',
                                            borderLeft: 'none'
                                        }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </InputGroup.Text>
                                </InputGroup>
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
                            // variant="outline-light"
                            variant="primary"
                            className="w-100 btn-custom py-2 fw-bold"
                            onClick={handleCreate}
                        >
                            Create New Space
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
