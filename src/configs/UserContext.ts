"use client";

import React, { createContext } from "react";

type UserContextType = {
    user: any,
    dispatch: React.Dispatch<{ type: "login"; payload: any } | { type: "logout" }>;
}
const UserContext = createContext<UserContextType | null>(null);
export default UserContext;
