"use client"
import { Alert, Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";

export default function Header({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Container fluid>
                    <Row>
                        <Col
                            md={2}
                            className="d-flex flex-column bg-white shadow-sm p-3"
                            style={{ minHeight: "100vh" }}
                        >
                            <h1 className="fw-bold text-primary mb-4 text-center" style={{ fontSize: "2rem" }}>
                                ELearnWeb
                            </h1>
                            <h6 className="text-muted mb-3">Chức năng</h6>
                            <Nav defaultActiveKey="/home" className="flex-column">
                                <Nav.Link href="#home" className="mb-2 text-dark">
                                    🏠 Trang chủ
                                </Nav.Link>
                                <Nav.Link href="#users" className="mb-2 text-dark">
                                    👥 Người dùng
                                </Nav.Link>
                                <Nav.Link href="#courses" className="mb-2 text-dark">
                                    📚 Khóa học
                                </Nav.Link>
                                <Nav.Link href="#settings" className="mb-2 text-dark">
                                    ⚙️ Cài đặt
                                </Nav.Link>
                            </Nav>
                        </Col>

                        {/* Nội dung chính */}
                        <Col md={10} className="p-4 bg-light">
                            {children}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}