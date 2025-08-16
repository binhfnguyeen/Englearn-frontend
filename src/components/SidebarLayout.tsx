"use client"
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect } from "react";
import UserContext from "@/configs/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ children }: { children: React.ReactNode }) {
    useEffect(()=>{
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
    const router = useRouter();
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
                            <h1
                                className="fw-bold text-primary mb-4 text-center"
                                style={{
                                    fontSize: "2rem",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    transition: "color 0.2s ease"
                                }}
                                onClick={() => {
                                    router.push("/");
                                }}
                            >
                                ELearnWeb
                            </h1>
                            <h6 className="text-muted mb-3">Chức năng</h6>
                            <Nav defaultActiveKey="/home" className="flex-column">
                                {user != null ? (
                                    <>
                                        <Nav.Link as={Link} href="/topics" className="mb-2 text-dark">
                                            Học từ vựng
                                        </Nav.Link>
                                        <Nav.Link as={Link} href="/tests" className="mb-2 text-dark">
                                            Kiểm tra từ vựng
                                        </Nav.Link>
                                        <Nav.Link as={Link} href="/conservation" className="mb-2 text-dark">
                                            Luyện nói với chatbot
                                        </Nav.Link>
                                        <Nav.Link as={Link} href={`/progress/${user.result.id}`} className="mb-2 text-dark">
                                            Theo dõi tiến độ
                                        </Nav.Link>
                                        <Button
                                            variant="outline-danger"
                                            className="mt-4"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="btn btn-outline-primary btn-sm flex-fill"
                                        >
                                            Đăng nhập
                                        </Link>
                                    </>
                                )}
                            </Nav>

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