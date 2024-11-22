import express from 'express'
import router from './src/routes/posts.routes.js';
import cors from 'cors';

const corsOpt = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

const app = express()

app.use(express.json());
app.use(express.static('uploads'));
app.use(cors(corsOpt));

app.use('/posts', router)

// porta 3000 usada em servidor local
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

