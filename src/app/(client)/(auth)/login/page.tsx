"use client"

import Apis from "@/configs/Apis";
import authApis from "@/configs/AuthApis";
import endpoints from "@/configs/Endpoints";
import UserContext from "@/configs/UserContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react"
import { Button, Container, Form, Spinner } from "react-bootstrap";

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const info = [{
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text"
    }, {
        "title": "Mật khẩu",
        "field": "password",
        "type": "password"
    }]

    const [user, setUser] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    const { dispatch } = useContext(UserContext)!;

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            let res = await Apis.post(endpoints['login'], { ...user });
            console.info(res.data);

            if (res.data.code == 1000) {
                const token = res.data.result.token;
                Cookies.set("accessToken", token, {
                    path: "/",
                    sameSite: "lax",
                });

                let profile = await authApis.post(endpoints['profile']);
                console.info(profile.data);
                dispatch({
                    type: "login",
                    payload: profile.data
                })
                router.push("/")
            }

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <h1 className="text-center text-success mt-2">ĐĂNG NHẬP</h1>
            <Form onSubmit={login}>
                {info.map(i =>
                    <Form.Group key={i.field} className="mb-3" controlId={i.field}>
                        <Form.Label>{i.title}</Form.Label>
                        <Form.Control
                            required
                            value={user[i.field] || ""}
                            onChange={e => setUser({ ...user, [i.field]: e.target.value })} type={i.type} placeholder={i.title} />
                    </Form.Group>
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Đăng nhập"}
                </Button>
            </Form>
        </Container>
    );
}