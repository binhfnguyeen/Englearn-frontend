"use client";

import UserContext from "@/configs/UserContext";
import { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import styles from "@/app/(client)/home.module.css";

export default function Home() {
    const context = useContext(UserContext);
    if (!context) return null;
    const { user } = context;

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: "url('/template/bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container className="text-center text-white">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <h1 className={`mb-4 fw-bold ${styles.textOutlineRed}`}>
                            Học Tiếng Anh dễ dàng hơn 🚀
                        </h1>
                        <p className={`lead mb-4 ${styles.textOutlineRed}`}>
                            Nâng cao trình độ tiếng với lộ trình học cá nhân hoá.
                        </p>

                        <div className="d-flex gap-3 justify-content-center">
                            {!user && (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 fw-bold shadow-lg"
                                        style={{
                                            borderRadius: "50px",
                                            border: "2px solid white",
                                            background: "transparent",
                                            color: "white",
                                            transition: "0.3s",
                                            textDecoration: "none",
                                        }}
                                        onMouseOver={(e) => {
                                            (e.currentTarget as HTMLElement).style.background =
                                                "rgba(255,255,255,0.2)";
                                        }}
                                        onMouseOut={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = "transparent";
                                        }}
                                    >
                                        Đăng nhập
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="px-4 py-2 fw-bold shadow-lg"
                                        style={{
                                            borderRadius: "50px",
                                            background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                                            border: "none",
                                            color: "white",
                                            transition: "0.3s",
                                            textDecoration: "none",
                                        }}
                                        onMouseOver={(e) => {
                                            (e.currentTarget as HTMLElement).style.opacity = "0.85";
                                        }}
                                        onMouseOut={(e) => {
                                            (e.currentTarget as HTMLElement).style.opacity = "1";
                                        }}
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
