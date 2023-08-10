const express= require("express")
const bodyParser = require("body-parser");
const db = require("./db");
const app = express();
app.use(bodyParser.json())

const  router  = require("./routes/route");
app.use('/',router)



db.connect()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

