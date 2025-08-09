"use client"

import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from "react";
import UserContext from "@/configs/UserContext";
import Link from "next/link";

export default function Header({ children }: { children: React.ReactNode; }) {
    const context = useContext(UserContext);

    if (!context) return null;

    const { user, dispatch } = context;

    const handleLogout = () => {
        dispatch({ type: "logout" });
    }

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
                                ELearnWeb Admin
                            </h1>
                            <h6 className="text-muted mb-3">Chức năng</h6>
                            {user && (
                                <Nav defaultActiveKey="/home" className="flex-column">
                                    <Nav.Link as={Link} href="/admin/topics" className="mb-2 text-dark">
                                        Thêm chủ đề tiếng Anh
                                    </Nav.Link>
                                    <Nav.Link as={Link} href="/admin/vocabularies" className="mb-2 text-dark">
                                        Thêm từ vựng
                                    </Nav.Link>
                                    <Nav.Link as={Link} href="/admin/tests" className="mb-2 text-dark">
                                        Thêm đề ôn tập
                                    </Nav.Link>
                                    <Button variant="outline-danger" className="mt-4" onClick={handleLogout}>
                                        Đăng xuất
                                    </Button>
                                </Nav>
                            )}

                            {!user && (
                                <div className="text-center text-muted mt-3">
                                    Vui lòng đăng nhập để sử dụng chức năng admin.
                                </div>
                            )}
                        </Col>

                        <Col md={10} className="p-4 bg-light">
                            {children}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}