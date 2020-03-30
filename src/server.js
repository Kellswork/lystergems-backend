import "core-js/stable";
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/',(req, res) => res.status(200).json({
  message: 'Welcome to Kells shopping site'
}));

export const server = () => {
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
};

export default app;
