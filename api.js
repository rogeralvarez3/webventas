const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const db = require("./db");
const {Server} = require("socket.io");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.get('/api', (req, res) => {
    db.getData(req.query, result => {
        res.send(result)
    })
})
app.post('/api', (req, res) => {
    db.save(req.body, result => {
        res.send(result)
        sockets.emit("update",req.body.tabla);
    })
})
app.post('/api/guardarVenta', (req, res) => {
    db.guardarVenta(req.body, result => {
        res.send(result)
        sockets.emit("update","ventas");
        sockets.emit("update","detalleVentas");
    })
})
app.put('/api', (req, res) => {
    db.save(req.body, result => {
        res.send(result)
        sockets.emit("update",req.body.tabla);
    })
})
app.delete('/api', (req, res) => {
    db.remove(req.body, result => {
        res.send(result)
        sockets.emit("update",req.body.tabla);
    })
})
const port = process.env.port || 3000;
const api = app.listen(port, () => {
    console.log(`Servidor escuchando en la url http://localhost:${port}`)
})
const sockets = new Server(api,{cors:{credentials:true}});
sockets.on("connection", socket => {
    console.log(`cliente io conectado con el id ${socket.id}`);
})
