"use client";

import Apis from "@/configs/Apis";
import authApis from "@/configs/AuthApis";
import endpoints from "@/configs/Endpoints";
import UserContext from "@/configs/UserContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import styles from "@/app/(client)/(auth)/login/Login.module.css";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const info = [
        { title: "Tên đăng nhập", field: "username", type: "text" },
        { title: "Mật khẩu", field: "password", type: "password" }
    ];

    const [user, setUser] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("UserContext not found. Wrap component with UserContext.Provider.");
    }
    const { dispatch } = userContext;

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await Apis.post(endpoints["login"], { ...user });

            if (res.data.code == 1000) {
                const token = res.data.result.token;
                Cookies.set("accessToken", token, { path: "/", sameSite: "lax" });

                const profile = await authApis.post(endpoints["profile"]);
                dispatch({ type: "login", payload: profile.data.result });
                await Apis.post(endpoints["dateLearned"](profile.data.result.id));
                router.push("/");
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2>Sign In</h2>
            <form onSubmit={login}>
                {info.map(i => (
                    <div key={i.field} className={styles.inputBox}>
                        <input
                            type={i.type}
                            placeholder={i.title}
                            required
                            value={user[i.field] || ""}
                            onChange={e => setUser({ ...user, [i.field]: e.target.value })}
                        />
                    </div>
                ))}
                <div className={styles.inputBox}>
                    <input type="submit" value={loading ? "..." : "Login"} id="btn" />
                </div>
                <div className={styles.group}>
                    <a href="/forgot-password">Forget Password</a>
                    <a href="/register">Signup</a>
                </div>
            </form>
        </>
    );
}
