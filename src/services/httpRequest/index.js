import axios from 'axios';
import authStore from '../../store/auth.store';

const httpRequest = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 100000,
});

const errorHandler = (error, hooks) => {
	if (error?.response?.status === 401) {
		authStore.logout();
	}

	if (error?.response) {
		if (error.response?.data?.data) {

		} else {

		}
	} else {

	}

	return Promise.reject(error.response);
};

httpRequest.interceptors.request.use((config) => {
	// const token = JSON.parse(authStore.token);
	const variable = JSON.parse(window.localStorage.getItem("persist:auth"));
	const token = variable.token.slice(1, -1);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

httpRequest.interceptors.response.use(
	(response) => response.data,
	errorHandler
);

export default httpRequest;
