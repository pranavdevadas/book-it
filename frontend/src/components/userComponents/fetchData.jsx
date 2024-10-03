import axios from 'axios';

export const fetchUserData = async () => {
    const response = await axios.get('/api/users/fetchData', {
        withCredentials: true,
    });
    return response.data;
};