import app from "./app.js";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";

await connectDB()
app.listen(PORT,() => {
    console.log(`servidor en puerto ${PORT}`)
})