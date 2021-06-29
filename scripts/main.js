class PlanningEvent{
    constructor(task, date)
    {
        this.task = task;
        this.date = date;
        this.executor = task.executor;
    }
}

const user_api_url = 'http://192.168.132.6/PlanningAPI/user/all';
const task_api_url = 'http://192.168.132.6/PlanningAPI/task/all';

const task_json = '[{"id":"fb26a723-cc50-4f21-ad4e-3f751605ff6d","subject":"Анализ","description":"","creationAuthor":1,"executor":3,"creationDate":"2021-06-05","planStartDate":"2021-06-05","planEndDate":"2021-06-08","endDate":"2021-06-05","status":1,"order":1},{"id":"fb26a723-cx50-4f21-ad4e-3f751605ff6d","subject":"Анализ","description":"","creationAuthor":1,"executor":1,"creationDate":"2021-06-05","planStartDate":"2021-06-05","planEndDate":"2021-06-08","endDate":"2021-06-05","status":1,"order":1},{"id":"0067e48e-e73c-4d97-91a3-ca24f6528558","subject":"Планирование","description":"","creationAuthor":1,"executor":1,"creationDate":"2021-06-05","planStartDate":"2021-06-07","planEndDate":"2021-06-08","endDate":"2021-06-05","status":1,"order":1},{"id":"5762faff-8606-4948-ba60-1c915811bc88","subject":"Проектирование","description":"","creationAuthor":1,"executor":2,"creationDate":"2021-06-05","planStartDate":"2021-06-08","planEndDate":"2021-06-09","endDate":"2021-06-05","status":1,"order":1},{"id":"50ec3f7c-ee7c-49cd-92f5-21f67048c1b0","subject":"Разработка","description":"","creationAuthor":1,"executor":3,"creationDate":"2021-06-05","planStartDate":"2021-06-08","planEndDate":"2021-06-11","endDate":"2021-06-05","status":1,"order":1},{"id":"x22ebb49-3260-473f-ad0c-9e235861fa96","subject":"Тестирование","description":"","creationAuthor":1,"executor":null,"creationDate":"2021-06-05","planStartDate":"2021-06-10","planEndDate":"2021-06-11","endDate":"2021-06-05","status":1,"order":1}, {"id":"y22ebb49-3260-473f-ad0c-9e235861fa96","subject":"Анализ кас","description":"","creationAuthor":1,"executor":null,"creationDate":"2021-06-05","planStartDate":"2021-06-10","planEndDate":"2021-06-11","endDate":"2021-06-05","status":1,"order":1},{"id":"z22ebb49-3260-473f-ad0c-9e235861fa96","subject":"Разработка","description":"","creationAuthor":1,"executor":null,"creationDate":"2021-06-05","planStartDate":"2021-06-10","planEndDate":"2021-06-11","endDate":"2021-06-05","status":1,"order":1} ,{"id":"f22ebb49-3260-473f-ad0c-9e235861fa96","subject":"План","description":"","creationAuthor":1,"executor":null,"creationDate":"2021-06-05","planStartDate":"2021-06-10","planEndDate":"2021-06-11","endDate":"2021-06-05","status":1,"order":1}]';
const users_json = '[{"id":1,"username":"user1","surname":"Петров","firstName":"Иван","secondName":""},{"id":2,"username":"user2","surname":"Иванов","firstName":"Пётр","secondName":""},{"id":3,"username":"user3","surname":"Васильев","firstName":"Артём","secondName":""},{"id":4,"username":"user4","surname":"Кузнецов","firstName":"Сергей","secondName":""},{"id":5,"username":"user5","surname":"Некрасов","firstName":"Артём","secondName":""}]';

const tasksListElement = document.querySelector('#taskList');
var taskElements = [];
const planning = document.querySelector('.planning-table tbody');
const mainPlanning = document.querySelector('#mainPlanning');

const users = JSON.parse(users_json);
var tasks = JSON.parse(task_json);


let dateOfWeek = []

let weekIndexRelativeToTheCurrentOne = 0;

function GetTasks()
{
    var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = false;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});
// xhr.withCredentials = true;
xhr.open("GET", "http://192.168.132.6/PlanningAPI/task/all");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.setRequestHeader("postman-token", "f6a73c3a-807c-4c0a-6e10-5eda44a2ff37");

xhr.send(data);
}


function getDateOfWeek(x = 0) {
    dateOfWeek = [];
    var today = new Date(),
        inWeek = new Date();
    var d = new Date(inWeek.setDate(today.getDate()+ (7 * x)));


    for (let i = 0; i < 7; ++i)
    {
        let day = d.getDay();
        let diff = d.getDate() - day + (day == 0 ? -6:1) + i;
        let date = new Date(d.setDate(diff));
        date.setHours(0,0,0,0);
        dateOfWeek.push(date);
    }
    dateOfWeek[6].setHours(23,59,59,999);
    let planning = document.querySelector('#planning-table');
    let planningHeader = document.getElementById('dateOfWeek');
    planningHeader.innerHTML = "";
    planningHeader.appendChild(document.createElement("th"));
    for (let date of dateOfWeek)
    {
        let dateTh = document.createElement('th');
        var day = date.getDate();
        var month = (date.getMonth() + 1);
        dateTh.textContent = (day < 10 ? 0 + day.toString(): day)  
                    + '.' + (month < 10 ? 0 + month.toString(): month);
        dateTh.dataset.date = date;
        planningHeader.appendChild(dateTh);
    }
}

function getTask(user)
    {
       return tasks.filter(function (el) {
                return el.executor == user.id
                        && new Date(el.planStartDate) >= dateOfWeek[0]
                        && new Date(el.planStartDate) <= dateOfWeek[6]
        });
    }

function getTaskGrid()
{
    let allRows = planning.querySelectorAll('.planning-row');
    allRows.forEach(function (el) { el.remove()});
    for (let user of users)
    {
        let userTask = getTask(user);
        userTask.forEach(function(task) {task.countEvents = 0;});
        let planningRow = document.querySelector('.planning-row-example').cloneNode(false);
        planningRow.classList.remove('planning-row-example');
        planningRow.classList.add('planning-row');
        planningRow.dataset.user = user.id;
        planning.appendChild(planningRow);
        let userTd = document.createElement('td');
        // userTd.id = 'user_' + user.id;
        userTd.classList.add('user');
        userTd.textContent = user.surname + ' ' + user.firstName;
        planningRow.appendChild(userTd);
        for (let i = 0; i < 7; i++)
        {
            planningTd = document.createElement('td');
            let planningUl = document.createElement('Ul');
            planningTd.classList.add('tasks');
            planningTd.appendChild(planningUl);

            planningUl.dataset.user = user.id;
            planningUl.classList.add('tasks-list');
            planningUl.dataset.date = dateOfWeek[i];
            let endDate = dateOfWeek[i];
            endDate.setHours(0,0,0,0);
            let endWeekDay = dateOfWeek[6].setHours(23,59,59,999);
            let taskOnDate = userTask.filter(function (el) { 
                var planStartDate = new Date(el.planStartDate);
                planStartDate.setHours(0,0,0,0); 
                let x = new Date(el.planEndDate);
                let planEndDate = x <= endWeekDay ? x.setHours(23,59,59,999) : endWeekDay;
                console.log(planEndDate);
                return planStartDate <= dateOfWeek[i] && 
                        dateOfWeek[i] <= planEndDate
            });
            
                // var planStartDate = new Date(el.planStartDate);
                // planStartDate.setHours(0,0,0,0); 
                // let planEndDate = new Date(el.planEndDate) <= endWeekDay ? new Date(el.planEndDate) : endWeekDay;
                // planEndDate.setHours(23,59,59,999);
                // return planStartDate >= dateOfWeek[i] && 
                //         dateOfWeek[i] <= planEndDate});
            for (let task of taskOnDate)
            {
                // let startDate = new Date(task.planStartDate);
                // let planEndDate = new Date(task.planEndDate) <= endWeekDay ? new Date(task.planEndDate) : endWeekDay;
                // console.log(startDate);
                // console.log(planEndDate);
                // for (let d = startDate; d <= planEndDate; d.setDate(d.getDate() + 1))
                {
                    task.countEvents += (isNaN(task.countEvents) ? 0 : 1);
                    let taskLi = document.createElement('li');
                    taskLi.dataset.taskId = task.id;
                    taskLi.classList.add('task');
                    taskLi.classList.add('tasks-list');
                    planningUl.appendChild(taskLi);
                    let taskSubject = document.createElement('span');
                    let toolTip = getToolTip(task, false);
                    // let toolTip = 'getToolTip(task, false)';
                    taskSubject.setAttribute('tooltip',toolTip);
                    taskSubject.textContent = task.subject;
                    taskLi.appendChild(taskSubject);
                    addDeleteButton(taskLi, task);
                    console.log(task.countEvents);
                }
                
            }
            planningRow.appendChild(planningTd);
        }
    }
    addDragOverListener();
    addDragEndListener();
}

function addDeleteButton(taskLi, task){
    let deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function(evt){
        let li = evt.target.parentElement;
        li.classList.remove('tasks-list');
        li.classList.remove('task');
        task.countEvents--;
        if (task.countEvents <= 0)
        {
            li.classList.add('backlog-task');
            li.draggable = true;
            let taskList = document.querySelector('#taskList');
            taskList.appendChild(li);
            task.planStartDate = null;
        }
        else{
            li.remove();
        }
        evt.target.remove();
    })
    taskLi.appendChild(deleteButton);
}

function getBacklogGrid ()
{
    let taskList = document.querySelector('#taskList');
    for (let task of tasks)
    {
        if (task.executor == null)
        {
            let taskLi = document.createElement('li');
            taskLi.dataset.taskId = task.id;
            taskLi.classList.add('backlog-task');
            // taskLi.textContent = task.subject;
            taskList.appendChild(taskLi);
            let taskSubject = document.createElement('span');
            let tooltip = getToolTip(task, true);
            taskSubject.setAttribute('tooltip',tooltip);
            let author = getUserFullName(task.creationAuthor);
            // taskSubject.innerHTML = '<b>' + author + '</b><br>' + task.subject;
            taskSubject.textContent = task.subject;
            taskLi.appendChild(taskSubject);
        }
    }
}

function getUserFullName(id)
{
    var user = users.filter(function (x) { return x.id == id});
    if (user.length > 0)
    {
        return user[0].surname + ' ' + user[0].firstName;
    }
    return '';
}

function getToolTip(task, backlog = false)
{
    let result = '';
    if (!backlog)
    {
        result += 'Author: ' + getUserFullName(task.creationAuthor) + "//";
    }
    result += 'Plan start date: ' + task.planStartDate + "//";
    result += 'Plan end date: ' + task.planEndDate;
    return result;

}

function ready() {
    getDateOfWeek();
    getTaskGrid();
    getBacklogGrid ();
    taskElements = tasksListElement.querySelectorAll('li.backlog-task');
    for (const task of taskElements)
    {
        task.draggable = true;
    }
    Date.prototype.format = function (mask, utc) {
        return dateFormat(this, mask, utc);
    };
    // GetTasks();
}

// listeners

var leftButton = document.querySelector('#leftButton');
var rightButton = document.querySelector('#rightButton');
var searchButton = document.querySelector('#taskSearchButton');


leftButton.addEventListener('click', function () {
    weekIndexRelativeToTheCurrentOne -= 1;
    getDateOfWeek(weekIndexRelativeToTheCurrentOne);
    getTaskGrid();
})

rightButton.addEventListener("click", function () {
    weekIndexRelativeToTheCurrentOne += 1;
    getDateOfWeek(weekIndexRelativeToTheCurrentOne);
    getTaskGrid();
})

searchButton.addEventListener('click', function() {
    let searchString = document.querySelector('#searchString');

})

tasksListElement.addEventListener(`dragstart`, (evt) => {
    evt.target.classList.add(`selected`);
  });

function addDragEndListener()
{
    planning.addEventListener(`dragend`, (evt) => {
        evt.target.classList.remove(`selected`);
        evt.target.classList.remove('backlog-task');
        evt.target.classList.add('task');
      });
}

function addDragOverListener()
{
    planning.addEventListener('dragover', (evt) => {
        evt.preventDefault();
        var activeElement = tasksListElement.querySelector('.selected');
        if (activeElement == null){
            activeElement = planning.querySelector('.selected');
        }
        const currentElement = evt.target.querySelector('ul');
        const isMoveable = currentElement == null || (activeElement !== currentElement && 
        currentElement.classList.contains('tasks-list')) ;
        if (!isMoveable) {
            return;
        }
        if (currentElement != null)
        {
            var task = tasks.filter(function(x) {
                return x.id === activeElement.dataset.taskId;
            })
            console.log(currentElement.dataset.user);
            currentElement.classList.add('selected-t');
            // currentElement.classList.remove('selected-t');
            if (task != null){
            task[0].executor = Number(currentElement.dataset.user);
            let startDate = new Date(currentElement.dataset.date);
            task[0].planStartDate = startDate;
            }
            if (activeElement != null)
            {
                currentElement.appendChild(activeElement);
                if (activeElement.querySelector('.delete-button') == null)
                {
                    addDeleteButton(activeElement, task);
                }
                
            }
        }
    })
}

tasksListElement.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
  });


document.addEventListener("DOMContentLoaded", ready);

