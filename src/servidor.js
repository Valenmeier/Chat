import express from "express";
import handlebars from "express-handlebars";
import _dirname from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/viewsRoutes.js";

const app = express();
const httpServer = app.listen(8080, () => {
  console.log(`Web corriendo en server 8080`);
});
const io = new Server(httpServer);

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, _dirname + "/views");
app.set(`view engine`, `handlebars`);

app.use(express.json());
app.use(express.static(_dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use(`/`, viewsRouter);
let messages = [];
io.on(`connection`, (socket) => {
  console.log(`Nuevo cliente conectado`);
  socket.on(`authenticated`, (user) => {
    socket.broadcast.emit(`newUser`, user);
  });

  socket.on(`message`, (data) => {
    messages.push(data);
    io.emit(`messageLogs`, messages);
  });
});
