import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:59904/api/",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});
