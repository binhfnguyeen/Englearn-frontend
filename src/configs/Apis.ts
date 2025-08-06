import axios from "axios";

const BASE_URL = "http://localhost:8080/elearn/api";

export default axios.create({
    baseURL: BASE_URL
})