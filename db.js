const mysql = require("mysql");

const cn = mysql.createConnection({
    server: "localhost",
    password: "cc882805@",
    database: "webventas",
    user: "root"
})
cn.on("error", (err) => {
    console.log(err)
})
cn.on("connection", () => {
    console.log("base de datos conectada!")
})
cn.connect();

const getData = (payload, callback) => {
    const condición = payload.condición ? ` where ${payload.condición}` : '';
    const sql = `select * from ${payload.tabla}${condición}`;
    cn.query(sql, (err, rows) => {
        err ? callback(err) : callback(rows)
    })

}
const guardarVenta = (payload, callback) => {
    console.log(payload, "guardarVenta")
    let detalle = Object.assign([], payload.detalle);
    delete payload.detalle
    save({ tabla: "ventas", data: Object.assign({}, payload) }, result => {
        if (!result.errno) {
            cn.query(`delete from detalleVentas where venta=${payload.id}`, err => {
                detalle.forEach(item => {
                    item.venta = result.insertId;
                    save({ tabla: "detalleVentas", data: item }, () => { })
                })
            })
            callback(result);
        }
    })

}
const save = (payload, callback) => {
    console.log(payload, "save")
    let sql;
    if (payload.data.id) {
        let fields = Object.keys(payload.data).map(key => { return `\`${key}\`=${typeof payload.data[key] === 'string' ? "'" + payload.data[key] + "'" : payload.data[key]}` })
        const id = payload.data.id;
        delete payload.data.id
        sql = `update ${payload.tabla} set ${fields.join(',')} where id=${id}`
    } else {
        let fields = Object.keys(payload.data).map(key => { return `\`${key}\`` })
        let values = Object.keys(payload.data).map(key => { return `${typeof payload.data[key] === 'string' ? "'" + payload.data[key] + "'" : payload.data[key]}` })
        sql = `insert into ${payload.tabla}(${fields.join(',')}) values(${values.join(',')})`
    }
    console.log(sql)
    cn.query(sql, (err, result) => {
        err ? callback(err) : callback(result)
    })
}

const remove = (payload, callback) => {
    if (payload.id) {
        const sql = `delete from ${payload.tabla} where id=${payload.id}`;
        console.log(sql)
        cn.query(sql, (err) => {
            err ? callback(err) : callback({ text: `registro eliminado con id ${payload.id}` })
        })
    }
}
module.exports = { getData, save, remove, guardarVenta }