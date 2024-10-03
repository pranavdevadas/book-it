import axios from 'axios';

export const fetchUserData = async () => {
    console.log('fetch')
    const response = await axios.get('/api/users/fetchData', {
        withCredentials: true,
    })
    console.log('private')
    console.log('data', response)
    return response.data;
};