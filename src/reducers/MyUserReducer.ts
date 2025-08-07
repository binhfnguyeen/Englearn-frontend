import Cookies from "js-cookie";

type Action = | {type: "login"; payload: any} | {type: "logout"};

const MyUserReducer = (current: any, action: Action): any => {
    switch (action.type){
        case 'login':
            return action.payload;
        case 'logout':
            Cookies.remove("accessToken");
            return null;
        default:
            return current;
    }
}

export default MyUserReducer;