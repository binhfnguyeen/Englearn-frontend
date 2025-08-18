"use client";

import Apis from "@/configs/Apis";
import endpoints from "@/configs/Endpoints";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/(client)/(auth)/login/Login.module.css"; // dùng lại chung CSS

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

export default function RegisterForm() {
    const info: { title: string; field: keyof User; type: string }[] = [
        { title: "Họ", field: "lastName", type: "text" },
        { title: "Tên", field: "firstName", type: "text" },
        { title: "Email", field: "email", type: "text" },
        { title: "Số điện thoại", field: "phone", type: "tel" },
        { title: "Tên đăng nhập", field: "username", type: "text" },
        { title: "Mật khẩu", field: "password", type: "password" },
        { title: "Xác nhận mật khẩu", field: "confirm", type: "password" },
    ];

    const [user, setUser] = useState<User>({
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        confirm: "",
        avatar: "",
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

                await Apis.post(endpoints["register"], formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                setMsg("Đăng ký thành công!");
                router.push("/login");
            } catch (ex) {
                console.error(ex);
                setMsg("Đăng ký không thành công!");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (msg) {
            const timer = setTimeout(() => setMsg(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    return (
        <div className={styles.formBox}>
            <h2>Sign Up</h2>
            {msg && (
                <p
                    style={{
                        color: msg.includes("không") ? "red" : "green",
                        textAlign: "center",
                    }}
                >
                    {msg}
                </p>
            )}

            <form onSubmit={register}>
                {info.map((i) => (
                    <div key={i.field} className={styles.inputBox}>
                        <input
                            type={i.type}
                            placeholder={i.title}
                            required
                            value={user[i.field]}
                            onChange={(e) =>
                                setUser({ ...user, [i.field]: e.target.value })
                            }
                        />
                    </div>
                ))}

                <div className={styles.inputBox}>
                    <input type="file" ref={avatarRef} />
                </div>

                <div className={styles.inputBox}>
                    <input
                        type="submit"
                        value={loading ? "..." : "Đăng ký"}
                        id="btn"
                        disabled={loading}
                    />
                </div>

                <div className={styles.group}>
                    <a href="/login">Sign in</a>
                    <a href="#">Forget password</a>
                </div>
            </form>
        </div>
    );
}
