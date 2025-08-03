import app from "./src/app.js";
import connectDB from "./src/db/dbConnect.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const port = process.env.PORT ?? 8080;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running at port : ", port);
    });
  })
  .catch((err) => {
    console.error("Server connected, Error :- ", err);
  });
