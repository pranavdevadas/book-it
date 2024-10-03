import axios from 'axios';

export const fetchUserData = async () => {
    try {
        const response = await axios.get('/api/users/fetchData', {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log(error)
        console.log("Error fetching user data:", error.message);
        throw error
    }
};