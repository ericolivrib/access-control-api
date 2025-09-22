import e from 'express';

const app = e();

const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST || 'localhost';

app.use(e.json());

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
}); 