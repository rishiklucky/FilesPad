import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Spinner, Badge, Modal, Dropdown } from 'react-bootstrap';
import { FaCloudUploadAlt, FaFile, FaTrash, FaQrcode, FaCopy, FaSignOutAlt, FaEye, FaEdit, FaSync, FaSave, FaTimes } from 'react-icons/fa';
import { getFiles, uploadFile, deleteFile, getTextPad, updateTextPad } from '../services/api';

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [duration, setDuration] = useState('1');
    const [showQrModal, setShowQrModal] = useState(false);
    const [lastUploaded, setLastUploaded] = useState(null);
    const [showSpaceCode, setShowSpaceCode] = useState(false);

    // TextPad State
    const [showTextPad, setShowTextPad] = useState(false);
    const [textPadContent, setTextPadContent] = useState('');
    const [textPadLoading, setTextPadLoading] = useState(false);
    const [textPadSaving, setTextPadSaving] = useState(false);

    const navigate = useNavigate();
    const spaceCode = localStorage.getItem('spaceCode');

    useEffect(() => {
        if (!spaceCode) {
            navigate('/');
            return;
        }
        fetchFiles();
    }, [spaceCode, navigate]);

    const fetchFiles = async () => {
        try {
            const res = await getFiles(spaceCode);
            setFiles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('spaceCode', spaceCode);
        formData.append('duration', duration);

        setUploading(true);
        try {
            const res = await uploadFile(formData);
            setLastUploaded(res.data);
            setShowQrModal(true);
            fetchFiles();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this file?')) return;
        try {
            await deleteFile(id);
            setFiles(files.filter(f => f._id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('spaceCode');
        navigate('/');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Link copied!');
    };

    const handleShowQr = (file) => {
        setLastUploaded({
            link: file.downloadUrl,
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(file.downloadUrl)}`
        });
        setShowQrModal(true);
    };

    // TextPad Functions
    const fetchTextPad = async () => {
        setTextPadLoading(true);
        try {
            const res = await getTextPad(spaceCode);
            setTextPadContent(res.data.content);
        } catch (err) {
            console.error('Failed to fetch TextPad', err);
        } finally {
            setTextPadLoading(false);
        }
    };

    const handleSaveTextPad = async (shouldClose = false) => {
        setTextPadSaving(true);
        try {
            await updateTextPad(spaceCode, textPadContent);
            if (shouldClose) {
                setShowTextPad(false);
            } else {
                alert('TextPad saved!');
            }
        } catch (err) {
            alert('Failed to save TextPad');
        } finally {
            setTextPadSaving(false);
        }
    };

    const openTextPad = () => {
        setShowTextPad(true);
        fetchTextPad();
    };

    return (
        <Container className="py-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-5">
                <div className="glass-card px-4 py-2">
                    <h2 className="fw-bold m-0">FilesPad <span className="text-primary">Space</span></h2>
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 gap-md-3">
                    <Button variant="outline-dark" onClick={openTextPad} className="glass-card py-2 px-3 btn-custom d-flex align-items-center gap-2">
                        <FaEdit /> TextPad
                    </Button>
                    <div
                        className="glass-card py-2 px-3 fw-bold text-warning position-relative"
                        style={{ cursor: 'pointer', minWidth: '140px' }}
                        onClick={() => setShowSpaceCode(!showSpaceCode)}
                    >
                        <div style={{ filter: showSpaceCode ? 'none' : 'blur(4px)', transition: 'filter 0.3s' }}>
                            CODE: {spaceCode}
                        </div>
                        {!showSpaceCode && (
                            <div className="position-absolute top-50 start-50 translate-middle w-100 text-center">
                                <span className="badge text-dark" style={{ fontSize: '1rem', opacity: 0.9 }}>View Code</span>
                            </div>
                        )}
                    </div>
                    <Button variant="outline-danger" onClick={handleLogout} className="btn-custom">
                        <FaSignOutAlt />
                    </Button>
                </div>
            </div>

            {/* Upload Section */}
            <div className="glass-card mb-5 text-center p-5" style={{ position: 'relative', zIndex: 100 }}>
                <input
                    type="file"
                    id="file-upload"
                    className="d-none"
                    onChange={handleUpload}
                    disabled={uploading}
                />
                <label htmlFor="file-upload" className="w-100 h-100" style={{ cursor: 'pointer' }}>
                    <div className="d-flex flex-column align-items-center gap-3">
                        {uploading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : (
                            <FaCloudUploadAlt size={64} className="text-primary mb-2" />
                        )}
                        <h4 className="fw-bold">{uploading ? 'Uploading...' : 'Click to Upload File'}</h4>
                        <p className="text-secondary">Max size: 100MB</p>
                    </div>
                </label>

                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    <label className="text-secondary">Auto-delete in:</label>
                    <Dropdown onSelect={(k) => setDuration(k)}>
                        <Dropdown.Toggle
                            variant="light"
                            id="duration-dropdown"
                            disabled={uploading}
                            className="text-start d-flex align-items-center gap-2"
                        >
                            {duration} Day{duration > 1 ? 's' : ''}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-0 overflow-hidden" style={{ border: '2px solid black', borderRadius: '8px', minWidth: '100%', zIndex: 1050 }}>
                            {[1, 2, 3, 4, 5, 6, 7].map(d => (
                                <Dropdown.Item
                                    key={d}
                                    eventKey={d}
                                    active={d.toString() === duration.toString()}
                                    className="fw-bold"
                                >
                                    {d} Day{d > 1 ? 's' : ''}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            {/* Files List */}
            <h4 className="mb-4 text-secondary">Your Files ({files.length})</h4>
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-4">
                    {files.map(file => (
                        <Col key={file._id} md={6} lg={4}>
                            <div className="file-card h-100 d-flex flex-column">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div className="p-3 bg-secondary bg-opacity-10 rounded">
                                        <FaFile size={24} className="text-dark" />
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h6 className="text-truncate mb-1" title={file.originalName}>{file.originalName}</h6>
                                        <small className="text-secondary d-block">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </small>
                                        <small className="text-warning" style={{ fontSize: '0.75rem' }}>
                                            Expires: {new Date(file.expiresAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>

                                <div className="mt-auto d-flex gap-2">
                                    <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm btn-custom flex-grow-1" title="Download">
                                        Download
                                    </a>
                                    <Button variant="info" size="sm" onClick={() => window.open(file.downloadUrl, '_blank')} className="btn-custom text-white" title="Preview">
                                        <FaEye />
                                    </Button>
                                    <Button variant="light" size="sm" onClick={() => handleShowQr(file)} className="btn-custom" title="QR Code">
                                        <FaQrcode />
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(file._id)} className="btn-custom" title="Delete">
                                        <FaTrash />
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                    {files.length === 0 && (
                        <Col xs={12} className="text-center text-secondary py-5">
                            No files yet. Upload one!
                        </Col>
                    )}
                </Row>
            )}

            {/* QR Code Modal */}
            <Modal show={showQrModal} onHide={() => setShowQrModal(false)} centered contentClassName="glass-card border-0">
                <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-25">
                    <Modal.Title>Share File</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {lastUploaded && (
                        <>
                            <div className="bg-white p-3 d-inline-block rounded mb-4">
                                <img src={lastUploaded.qrCode} alt="QR Code" className="img-fluid" style={{ maxWidth: '200px' }} />
                            </div>
                            <div className="input-group mb-3">
                                <Form.Control
                                    value={lastUploaded.link}
                                    readOnly
                                    className="bg-dark border-secondary text-white"
                                />
                                <Button variant="secondary" onClick={() => copyToClipboard(lastUploaded.link)}>
                                    <FaCopy />
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {/* TextPad Modal */}
            <Modal show={showTextPad} onHide={() => setShowTextPad(false)} size="lg" centered contentClassName="glass-card border-0">
                <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-25">
                    <Modal.Title className="d-flex align-items-center">
                        <FaEdit className="me-2 text-primary" /> TextPad
                    </Modal.Title>
                    <div className="ms-auto me-3">
                        <Button variant="outline-light" size="sm" onClick={fetchTextPad} disabled={textPadLoading} className="btn-custom py-1">
                            <FaSync className={textPadLoading ? 'fa-spin' : ''} /> Refresh
                        </Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {textPadLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-secondary">Loading content...</p>
                        </div>
                    ) : (
                        <Form.Control
                            as="textarea"
                            rows={12}
                            placeholder="Paste or type your text here..."
                            value={textPadContent}
                            onChange={(e) => setTextPadContent(e.target.value)}
                            className="bg-dark text-white border-secondary border-opacity-50"
                            style={{ resize: 'none' }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer className="border-secondary border-opacity-25 justify-content-between">
                    <Button variant="outline-danger" onClick={() => setShowTextPad(false)} className="btn-custom">
                        <FaTimes className="me-2" /> Close
                    </Button>
                    <div className="d-flex gap-2">
                        <Button variant="success" onClick={() => handleSaveTextPad(false)} disabled={textPadSaving} className="btn-custom">
                            <FaSave className="me-2" /> {textPadSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="primary" onClick={() => handleSaveTextPad(true)} disabled={textPadSaving} className="btn-custom">
                            <FaSave className="me-2" /> Save & Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default Dashboard;
