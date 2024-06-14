const express = require('express')
const fs = require('fs')
let users = require("./MOCK_DATA.json")
const app = express()

//Middleware
app.use(express.urlencoded({ extended: false }))

const PORT = 3000

app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li> ${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html)
})

app.get('/api/users', (req, res) => {
    return res.json(users)
})

//Create new user
app.post('/api/users', (req, res) => {
    const body = req.body
    users.push({ ...body, id: users.length + 1 })
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({ status: "Success", id: users.length + 1 })
    })
})

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const user = users.find((user) => user.id === id)
        return res.json(user)
    })
    .patch((req, res) => {
        const userId = parseInt(req.params.id, 10);
        const updates = req.body;
    
        let user = users.find(u => u.id === userId);
    
        if (!user) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }
    
        user = { ...user, ...updates };
    
        users = users.map(u => (u.id === userId ? user : u));
    
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).json({ status: "Error", message: err.message });
            }
            return res.json({ status: "Success", user });
        });
    })
    .delete((req, res) => {
        return res.json({ status: pending })
    })

app.listen(PORT, () => console.log("Server listening"))