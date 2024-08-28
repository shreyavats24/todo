var textBox = document.getElementById("text");
var parent = document.getElementById("mylist");

let id;
var editId = null;
var toDos = readToDoFromStorage();
//console.log(toDos);
toDos.forEach(function(todo){
    displayOnUI(todo);
});
if(toDos.length)
{
    id=toDos[toDos.length-1].id+1;
}
else
{
    id=1;
}

textBox.addEventListener("keypress", function (event) {
    if (event.code === "Enter") {
        var value = event.target.value.trim();
        //alert(`${value}`);
        if (value.trim() === "") {
            alert("You must enter something...");
            // return; 
        }
        else if(editId!=null)
        {
            //alert("inside edit");
            //var todos = readToDoFromStorage();
            var todoItem = toDos.find(t => t.id === editId);
            if (todoItem) {
            todoItem.text = value; 
            storeAllDataInStorage(toDos);  
            refreshUI();
            event.target.value = ""; 
            editId = null;    
            }
        }
        else {
            //alert("create toDo");
            createToDo(value);
            event.target.value = ""; // cleanup
        }
    }
});
function refreshUI() {
    parent.innerHTML = '';
    toDos.forEach(function(todo){
        displayOnUI(todo);
    });  
}
function createToDo(value) {
    const todo = {
        text: value,
        id: id++,
        completed: false
        //checked: false
    };
    //console.log(todo);
    displayOnUI(todo);
    toDos.push(todo);
    storeDataInStorage(todo);
}

function displayOnUI(todo) {
    var li = document.createElement("li");
    li.id = "todo-" + todo.id;  
    var p = document.createElement("p");
    li.appendChild(p);
    p.innerText = todo.text;

    if (todo.completed) {
        li.style.textDecoration = 'line-through';
    }
    var check = createCheckBox(todo.id, todo.completed);
    check.classList.add("btn");
    li.appendChild(check);
    var update = doUpdate(todo.id);
    update.classList.add("btn2");
    li.appendChild(update);
    var cross = createCross(todo.id);
    cross.classList.add("btn3")
    li.appendChild(cross);
    parent.appendChild(li);
}

function doUpdate(todoId) {
    //console.log(todoId);
    var pencil = document.createElement("img");
    pencil.src = "pencil.jpg";
    pencil.width = 15;
    pencil.height = 15;

    pencil.addEventListener("click", function(event) {
        var li = pencil.parentElement;
        var currentText = li.innerText.replace("CROSS IMAGE.png pencil.jpg ", "").trim(); 
        textBox.value = currentText; 
        editId = todoId;     
    });
    return pencil;
}

function createCheckBox(todoId, isChecked) {
    var input = document.createElement("input");
    input.type = 'checkbox';
    input.checked = isChecked;

    input.addEventListener("click", function () {
        if (typeof toDos === 'undefined') {
            console.error("toDos is not defined.");
            return;
        }

        var todos=readToDoFromStorage();
        //console.log(toDos);
        var todoItem = toDos.find(t => t.id === todoId);
        //console.log(todoItem);

        if (!todoItem) {
            console.error("To-do item not found with ID:", todoId);
            return;
        }
        //console.log(input.checked);
        todoItem.completed = input.checked;

        storeAllDataInStorage(toDos);

        var li = input.parentElement;
        if (li && li.tagName === 'LI') {
            li.style.textDecoration = input.checked ? 'line-through' : 'none';
        }
    });

    return input;
}


function createCross(todoId) {
    var img = document.createElement("img");
    img.src = "CROSS IMAGE.png";
    img.width = 16;
    img.height = 16;
    img.addEventListener("click", function() {
        toDos = toDos.filter(t => t.id !== todoId);
    
        storeAllDataInStorage(toDos);
        var li = img.parentElement;
        li.remove();
    });
    return img;
}

function storeAllDataInStorage(todos) {
    //console.log(todos);
    localStorage.setItem("todo", JSON.stringify(todos));
}

function storeDataInStorage(todo) {
    var oldData = localStorage.getItem("todo");
    if (oldData) {
        oldData = JSON.parse(oldData);
        oldData.push(todo);
    } 
    else
    {
        oldData = [todo];
    }
    localStorage.setItem("todo", JSON.stringify(oldData));
}
    
function readToDoFromStorage() {
var TodosString = localStorage.getItem("todo");
if (!TodosString) {
    return [];
}
return JSON.parse(TodosString);
}
    
    
       
