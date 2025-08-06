import axios from "axios";

const BASE_URL = process.env.BASE_URL

const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer`
        }
    })
}

export default authApis;