import dotenv from 'dotenv'; 
dotenv.config();

const config = {
    apiBaseURL: process.env.API_BASE_URL
}

export default config;