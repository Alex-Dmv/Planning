const express = require('express');
const fetch = require('node-fetch');

const fs = require('fs');
const user_api_url = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users';
const task_api_url = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks';

// const user_api_url = 'http://192.168.132.6/PlanningAPI/user/all';
// const task_api_url = 'http://192.168.132.6/PlanningAPI/task/all';
// const update_task_api_url = 'http://192.168.132.6/PlanningAPI/task/update';

const host = "127.0.0.1";
const port = 8032;

const requestListener = function (req, res) {
    let file = fs.readFileSync(__dirname + "/index.html");
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(file);
};

let app = express();
app.use(express.static(__dirname + '/content'));
app.use(express.static(__dirname + '/scripts'));
app.get('/', requestListener);

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

function getUsers(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    fetch(user_api_url)
        .then(x => x.buffer())
        .then(json => res.end(json));
}

function getTasks(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    fetch(task_api_url)
        .then(x => x.buffer())
        .then(json => res.end(json));
}

// function updateTask(req, res){
//     res.setHeader('Content-Type', 'application/json');
//     res.
// }

app.get('/users', getUsers);
app.get('/tasks', getTasks);
// app.put('/update-task', updateTask);