import React, { useState } from 'react';
import { Offcanvas, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function CreateUser({ show, handleClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');  // Нове поле для підтвердження пароля
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isSuperuser, setIsSuperuser] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/create-user/', {
                username: username,
                password: password,
                password2: password2,  // Додаємо поле password2 до запиту
                email: email,
                first_name: firstName,
                last_name: lastName,
                is_doctor: isDoctor,
                is_user: isUser,
                is_staff: isStaff,
                is_superuser: isSuperuser,
            });
            console.log(response.data);
            alert('User created successfully!');
            handleClose(); // Закрити шторку після успішного створення користувача
        } catch (error) {
            console.error('There was an error!', error);
            if (error.response && error.response.data) {
                alert(JSON.stringify(error.response.data));
            } else {
                alert('Error creating user');
            }
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Create New User</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword2" className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formFirstName" className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLastName" className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="isDoctor"
                        label="Is Doctor"
                        checked={isDoctor}
                        onChange={(e) => setIsDoctor(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        id="isUser"
                        label="Is User"
                        checked={isUser}
                        onChange={(e) => setIsUser(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        id="isStaff"
                        label="Is Staff"
                        checked={isStaff}
                        onChange={(e) => setIsStaff(e.target.checked)}
                    />
                    <Form.Check
                        type="checkbox"
                        id="isSuperuser"
                        label="Is Superuser"
                        checked={isSuperuser}
                        onChange={(e) => setIsSuperuser(e.target.checked)}
                    />
                    <Button variant="primary" type="submit" className="mt-3">
                        Create User
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default CreateUser;