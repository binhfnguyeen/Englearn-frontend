"use client"
import Apis from "@/configs/Apis";
import endpoints from "@/configs/Endpoints";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";

interface User {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    confirm: string;
    avatar: string;
}

export default function Register() {
    const info: { title: string; field: keyof User; type: string }[] = [{
        "title": "Họ",
        "field": "lastName",
        "type": "text"
    }, {
        "title": "Tên",
        "field": "firstName",
        "type": "text"
    }, {
        "title": "Email",
        "field": "email",
        "type": "text"
    }, {
        "title": "Số điện thoại",
        "field": "phone",
        "type": "tel"
    }, {
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text"
    }, {
        "title": "Mật khẩu",
        "field": "password",
        "type": "password"
    }, {
        "title": "Xác nhận mật khẩu",
        "field": "confirm",
        "type": "password"
    }];

    const [user, setUser] = useState<User>({
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        confirm: "",
        avatar: ""
    });
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const avatarRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const validate = () => {
        if (!user) {
            setMsg("Vui lòng nhập đầy đủ thông tin!");
            return false;
        }

        if (!user.password || !user.confirm || user.password !== user.confirm) {
            setMsg("Mật khẩu KHÔNG khớp!");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            setMsg("Email không hợp lệ!");
            return false;
        }

        const phoneRegex = /^(0[0-9]{9,10})$/;
        if (!phoneRegex.test(user.phone)) {
            setMsg("Số điện thoại không hợp lệ!");
            return false;
        }

        setMsg("");
        return true;
    };

    const register = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            try {
                setLoading(true);
                let formData = new FormData();
                for (let key in user) {
                    const typedKey = key as keyof User;
                    if (typedKey !== "confirm") {
                        formData.append(typedKey, user[typedKey]);
                    }
                }

                if (avatarRef.current?.files?.length) {
                    formData.append("avatar", avatarRef.current.files[0]);
                }

                let res = await Apis.post(endpoints['register'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setMsg("Đăng ký thành công!")
                router.push("/login")

            } catch (ex) {
                console.error(ex);
                setMsg("Đăng ký không thành công!")
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (msg) {
            const timer = setTimeout(() => setMsg(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    return (
        <>
            <h1 className="text-center text-success mt-2">ĐĂNG KÝ</h1>

            {msg && (
                <Alert
                    variant={msg.includes("không") ? "danger" : "success"}
                    className="py-2 position-fixed top-0 end-0 m-3 shadow"
                    style={{ zIndex: 9999, minWidth: "250px" }}
                >
                    {msg}
                </Alert>

            )}

            <Form onSubmit={register}>
                {info.map(i => <Form.Group key={i.field} className="mb-3" controlId={i.field}>
                    <Form.Label>{i.title}</Form.Label>
                    <Form.Control required value={user[i.field]} onChange={e => setUser({ ...user, [i.field]: e.target.value })} type={i.type} placeholder={i.title} />
                </Form.Group>)}

                <Form.Group className="mb-3">
                    <Form.Label>Ảnh đại diện</Form.Label>
                    <Form.Control type="file" ref={avatarRef} />
                </Form.Group>

                <div className="mt-4">
                    <Button variant="primary" type="submit" disabled={loading} className="px-4">
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                                Đang xử lý...
                            </>
                        ) : (
                            "Đăng ký"
                        )}
                    </Button>
                </div>
            </Form>
        </>
    );
}