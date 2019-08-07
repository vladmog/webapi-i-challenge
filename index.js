const express = require('express');
const server = express();

const db = require('./data/db.js');
const { find, findById, insert, remove, update } = db;

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Hello World');
});

server.get('/api/users', (req, res) => {
    find()
        .then((users) => {
            res.status(200).json(users)
        })
        .catch(() => {
            res.status(500).json({ error: "The users information could not be retrieved." })
        })
});

server.post('/api/users', (req, res) => {
    const postData = req.body;
    if (postData.name && postData.bio){
        insert(postData)
            .then((postData) => {
                res.status(201).json(postData);
            })
            .catch(() => {
                res.status(500).json({ message: 'error getting the list of hubs' });
            })
    } else {
        return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    findById(id)
        .then((user) => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist."})
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "The user information could not be retrieved." })
        })
});


server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    let deletedUser
    findById(id)
        .then((user) => {
            if (user) {
                deletedUser = user
            }
        })
    remove(id)
        .then((deleted) => {
            if(deleted){
                res.status(200).json({ message: `user with ID ${deletedUser.id} deleted`})
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The user could not be removed" })
        })
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    
    if (changes.name && changes.bio) {
        update(id, changes)
        .then((updated) => {
            if (updated) {
                res.status(200).json(changes)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The user information could not be modified." })
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
})







server.listen(8000, () => console.log('API running on port 8000'));

