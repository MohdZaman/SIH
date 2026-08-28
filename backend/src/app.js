import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js'; 

const app = express();

app.use(cors()); 
app.use(express.json()); 


app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "BIS SAATHI Backend is running perfectly on port 5005!"
    });
});

export default app;