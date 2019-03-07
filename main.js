let items = []

const url = 'http://localhost:3000/items';

window.onload = loadArray;

function formSubmitted(e) {
    e.preventDefault();
    const inputs = e.target.elements;
    const value = inputs.namedItem('inputNoteText').value;
    const id = inputs.namedItem('id').value;
    const isdone = false;
    const record = {value, id, isdone};
    if(id !== ''){
        saveChanges(record);
    } else {
        addNote(record);
    }
}

function saveChanges(record) {
    const id = record.id;
    const newValue = record.value;
    let found = items.find(item => item.id === parseInt(id, 10));
    found.value = newValue;
    $.ajax({url: url + '/' + id, type: 'PUT', data: found})
    .then(() => {
        clearInput();
        loadArray();
    })
}

function addNote(record) {
    const value = record.value;
    record.id = "";
    if (value === "") {
        alert("You have to type some text");
    } else {
        $.post(url, record)
        .then(() => {
            loadArray();
            clearInput();
        })
    }
}

function clearInput() {
    document.getElementById("main-form").reset();
}

function loadArray() {
    document.getElementById("list").innerHTML = "";
    $.get(url)
    .then(data => {
        items = data || [];
        data && data.forEach(item => visualize(item));
    })
};

function visualize(currentRecord) {
    let strLi = `<li onclick="toggleChecked(event)" 
            data-value="${currentRecord.value}" 
            data-id="${currentRecord.id}" 
            data-isdone = ${currentRecord.isdone}">
            ${currentRecord.value}
            <span class="close" onclick="deleteNote(event)">x</span>
            <i class="fas fa-edit" onclick="updateNote(event)"></i>
        </li>`;
    document.getElementById("list").innerHTML += strLi;
}


function toggleChecked(event) {
    event.stopPropagation();
    let currentNote = event.target;
    const dataSet = currentNote.dataset;
    const id = dataSet.id;
    let found = items.find(item => item.id === parseInt(id, 10));
    
    if (!currentNote.classList.contains("line-through")) {
        currentNote.classList.add("line-through");
        found.isdone = true;
    } else {
        currentNote.classList.remove("line-through");
        found.isdone = false;
    }
}

function updateNote(e) {
    e.stopPropagation();
    
    var currentLi = e.target.parentNode.dataset;
    document.getElementById("id").value = currentLi.id;
    document.getElementById("inputNoteText").value = currentLi.value;
}


function deleteNote(event) {
    event.stopPropagation();
    let currRecord = event.target.parentElement;
    const id = currRecord.dataset.id;
    $.ajax({url: url + '/' + id, type: 'DELETE'})
    .then(() => {
        clearInput();
        loadArray();
    })
    
}
