const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send(`server content is comming`);
})



app.listen(port, () =>{
    console.log(`server start on port ${port}`);
})