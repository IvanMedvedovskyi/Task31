//Функция для создания элементов
function createElement(tagName, attr, textContent, parent) {
  const element = document.createElement(tagName);

  for (let key in attr) {
    if (key === "classList") {
      element.setAttribute("class", attr[key]);
    } else {
      element.setAttribute(key, attr[key]);
    }
  }

  element.textContent = textContent;
  parent.appendChild(element);
  return element;
}

//Создание таблицы
const divTable = createElement(
  "div",
  { classList: "div_table" },
  null,
  document.body
);
const btnAddUser = createElement(
  "a",
  { classList: "double-border-button" },
  "ADD NEW USERS:",
  divTable
);
const createTable = createElement(
  "table",
  { classList: "tableContainer" },
  null,
  divTable
);

const tr = createElement("tr", null, null, createTable);
const tdName = createElement("td", null, "Name", tr);
const tdPassword = createElement("td", null, "Password", tr);
const tdAge = createElement("td", null, "Age", tr);
const tdEmail = createElement("td", null, "Email", tr);
const tdPhoneNumber = createElement("td", null, "PhoneNumber", tr);
const tdCardNumber = createElement("td", null, "CardNumber", tr);
const tdAction = createElement("td", null, "Action", tr);

//Создаём переменные, в которых будут находиться регулярные выражения для проверки данных

const personRegex = /^([A-ZА-Я])/;
const ageRegex = /\d{2,3}/;
const emailRegex = /\w{1,}@email.com/;
const phoneRegex = /^(\+380)\d{9}$/
const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

////Перебираем данные, которые извлекли из LocalStorage и добавляем в таблицу
let getUsers = JSON.parse(localStorage.getItem("DataCenter"));

//Если getUsers пустой, то в таблице будут выводиться данные, которые находятся в файле data.js
if(!getUsers || getUsers.length === 0) {
    localStorage.setItem('DataCenter', JSON.stringify(users))
} else {
    //Если всётаки в LocalStorage находятся хоть какие-то данные, то они будут выводиться в таблицу
    for (let i = 0; i < getUsers.length; i++) {
        
        const newRow = createTable.insertRow();
        newRow.setAttribute("data-index", i + 1);
      
        const cellFirst = newRow.insertCell();
        cellFirst.innerHTML = getUsers[i].person;
        cellFirst.setAttribute("data-index", i + 1);

        const cellSecond = newRow.insertCell();
        cellSecond.innerHTML = getUsers[i].password;
        cellSecond.setAttribute("data-index", i + 1);

        const cellThird = newRow.insertCell();
        cellThird.innerHTML = getUsers[i].age;
        cellThird.setAttribute("data-index", i + 1);

        const cellFourth = newRow.insertCell();
        cellFourth.innerHTML = getUsers[i].email;
        cellFourth.setAttribute("data-index", i + 1);

        const cellFifth = newRow.insertCell();
        cellFifth.innerHTML = getUsers[i].phoneNumber;
        cellFifth.setAttribute("data-index", i + 1);

        const cellSixth = newRow.insertCell();
        cellSixth.innerHTML = getUsers[i].cardNumber;
        cellSixth.setAttribute("data-index", i + 1);

        const cellSeventh = newRow.insertCell();
        cellSeventh.innerHTML = `<a href="" class="glow-button edit-button" data-index=${i + 1}>Edit</a>
                             <a href="" class="glow-button delete-button" data-index=${i + 1}>Delete</a>`;


       //Обработчик события для кнопки Edit
        const editBtn = cellSeventh.querySelector('.edit-button');        
        editBtn.addEventListener('click', editInfo);

        const deleteBtn = cellSeventh.querySelector('.delete-button');
        deleteBtn.addEventListener('click', deleteInfo);
      }

      
}


//Создаём событие для кнопки ADD NEW USER

function createForm(isEdit = false) {

  const editForm = document.querySelector('.formContainer');
  if(editForm) {
    editForm.remove();
  }

  const divForm = createElement(
    "div",
    { classList: "formContainer" },
    null,
    divTable
  );

  divTable.insertBefore(divForm, divTable.children[1]);
  const form = createElement("form", null, null, divForm);

  const nameLabel = createElement("label", null, "Name:", form);
  const nameInput = createElement(
    "input",
    { type: "text", classList: "nameInput", id: 'Name' },
    null,
    form
  );

  const passwordLabel = createElement("label", null, "Password:", form);
  const passwordInput = createElement(
    "input",
    { type: "password", classList: "passwordInput", id: 'Password' },
    null,
    form
  );

  const ageLabel = createElement("label", null, "Age:", form);
  const ageInput = createElement(
    "input",
    { type: "number", classList: "ageInput", id: 'Age' },
    null,
    form
  );

  const emailLabel = createElement("label", null, "Email:", form);
  const emailInput = createElement(
    "input",
    { type: "email", classList: "emailInput", id: 'Email' },
    null,
    form
  );

  const phoneLabel = createElement("label", null, "Phone Number:", form);
  const phoneInput = createElement(
    "input",
    { type: "tel", classList: "phoneInput", id: 'Phone' },
    null,
    form
  );

  const cardLabel = createElement("label", null, "Card Number:", form);
  const cardInput = createElement(
    "input",
    { type: "text", classList: "cardInput", id: 'Card' },
    null,
    form
  );

  const submitButton = createElement(
    "button",
    { classList: "submitButton" },
    "Submit",
    form
  );

  if (isEdit) {
    submitButton.onclick = updateInfo;
  } else {
    submitButton.onclick = sendFormInfo;
  }
  


}

// Обработчик события для кнопки btnAddUser
btnAddUser.addEventListener("click", function () {
    createForm();
});

//Получаем данные из формы и отправляем в LC по нажатию кнопки Submit
function sendFormInfo(element) {
  element.preventDefault();

  //Переменная для проверки валидации
  let isValidInfo = true;
  let newData = {};

  //Получаем данные из инпутов
  const getInputName = document.querySelector(".nameInput").value;
  const getInputPassword = document.querySelector(".passwordInput").value;
  const getInputAge = document.querySelector(".ageInput").value;
  const getInputEmail = document.querySelector(".emailInput").value;
  const getInputPhone = document.querySelector(".phoneInput").value;
  const getInputCard = document.querySelector(".cardInput").value;

  //Проверка данных регулярными выражениями
  if (personRegex.test(getInputName)) {
    newData["person"] = getInputName;
  } else {
    alert("Введіть ім'я з великої літери!");
    isValidInfo = false;
  }

  if (getInputPassword.length >= 6 && getInputPassword.length <= 12) {
    newData["password"] = getInputPassword;
  } else {
    alert("Довжина пароля повинна складати від 1 до 12 символів!");
    isValidInfo = false;
  }

  if (ageRegex.test(getInputAge)) {
    newData["age"] = getInputAge;
  } else {
    alert("Ваш вік може складатися від 2 до 3 цифр");
    isValidInfo = false;
  }

  if (emailRegex.test(getInputEmail)) {
    newData["email"] = getInputEmail;
  } else {
    alert("Приклад email: mypersonalmail98@email.com");
    isValidInfo = false;
  }

  if (phoneRegex.test(getInputPhone)) {
    newData["phoneNumber"] = getInputPhone;
  } else {
    alert("Приклад номеру телефона: +380XXXXXXXXX");
    isValidInfo = false;
  }

  if (cardRegex.test(getInputCard)) {
    newData["cardNumber"] = getInputCard;
  } else {
    alert("Приклад номеру карты: ХХХХ-ХХХХ-ХХХХ-ХХХХ");
    isValidInfo = false;
  }
  
  
  //Очищаем input после нажатия кнопки submit
  if(isValidInfo) {
    const container = document.querySelector(".formContainer");
    container.remove()
  }



//Выполняем PUSH данных в LocalStorage
  if (isValidInfo) {
    getUsers.push(newData);
    localStorage.setItem("DataCenter", JSON.stringify(getUsers));
//После нажатия кнопки submit создаём новуе строку в table
    const newRow = createTable.insertRow();
    newRow.setAttribute("data-index", getUsers.length);

    const cellFirst = newRow.insertCell();
    cellFirst.setAttribute("data-index", getUsers.length);
    cellFirst.innerHTML = getInputName;

    const cellSecond = newRow.insertCell();
    cellSecond.setAttribute("data-index", getUsers.length);
    cellSecond.innerHTML = getInputPassword;

    const cellThird = newRow.insertCell();
    cellThird.setAttribute("data-index", getUsers.length);
    cellThird.innerHTML = getInputAge;

    const cellFourth = newRow.insertCell();
    cellFourth.setAttribute("data-index", getUsers.length);
    cellFourth.innerHTML = getInputEmail;

    const cellFifth = newRow.insertCell();
    cellFifth.setAttribute("data-index", getUsers.length);
    cellFifth.innerHTML = getInputPhone;

    const cellSixth = newRow.insertCell();
    cellSixth.setAttribute("data-index", getUsers.length);
    cellSixth.innerHTML = getInputCard;


    if (
        personRegex.test(getInputName) &&
        ageRegex.test(getInputAge) &&
        emailRegex.test(getInputEmail) &&
        phoneRegex.test(getInputPhone) &&
        cardRegex.test(getInputCard)
      ) {
        const cellSeventh = newRow.insertCell();
        cellSeventh.innerHTML = `<a href="" class="glow-button edit-button" data-index=${getUsers.length}>Edit</a>
                             <a href="" class="glow-button delete-button" data-index=${getUsers.length}>Delete</a>`;   

        //Обработчик события для кнопки Edit
        const editBtn = cellSeventh.querySelector('.edit-button');        
        editBtn.addEventListener('click', editInfo);   
        
        const deleteBtn = cellSeventh.querySelector('.delete-button');
        deleteBtn.addEventListener('click', deleteInfo);
                                    
      }

  }

}

//С помощью кнопки Edit получаем данные из ячейки таблицы
let row = null;
function editInfo(event) {
  event.preventDefault();

  const index = event.target.getAttribute("data-index");
  row = document.querySelector(`tr[data-index="${index}"]`);

  const name = row.cells[0].innerHTML;
  const password = row.cells[1].innerHTML;
  const age = row.cells[2].innerHTML;
  const email = row.cells[3].innerHTML;
  const phoneNumber = row.cells[4].innerHTML;
  const cardNumber = row.cells[5].innerHTML;

    const addUserForm = document.querySelector(".formContainer");
    if(addUserForm){
      addUserForm.remove()
  }

  createForm(true);
  
  document.getElementById('Name').value = name;
  document.getElementById('Password').value = password;
  document.getElementById('Age').value = age;
  document.getElementById('Email').value = email;
  document.getElementById('Phone').value = phoneNumber;
  document.getElementById('Card').value = cardNumber;
  
};

//Функция, которая обновляет старые данные на новые, после нажатия кнопки Edit
function updateInfo(){
  const index = row.getAttribute("data-index");
  const newData = {
    person: document.getElementById("Name").value,
    password: document.getElementById("Password").value,
    age: document.getElementById("Age").value,
    email: document.getElementById("Email").value,
    phoneNumber: document.getElementById("Phone").value,
    cardNumber: document.getElementById("Card").value
  };

  let isValidInfo = true;

  for (let key in newData) {
    switch (key) {
      case "person":
        if (!personRegex.test(newData[key])) {
          alert("Введіть ім'я з великої літери!");
          isValidInfo = false;
        }
        break;
      case "password":
        if (
          newData[key].length < 6 ||
          newData[key].length > 12
        ) {
          alert("Довжина пароля повинна складати від 6 до 12 символів!");
          isValidInfo = false;
        }
        break;
      case "age":
        if (!ageRegex.test(newData[key])) {
          alert("Ваш вік може складатися від 2 до 3 цифр!");
          isValidInfo = false;
        }
        break;
      case "email":
        if (!emailRegex.test(newData[key])) {
          alert("Приклад email: mypersonalmail@example.com");
          isValidInfo = false;
        }
        break;
      case "phoneNumber":
        if (!phoneRegex.test(newData[key])) {
          alert("Приклад номеру телефона: +380XXXXXXXXX");
          isValidInfo = false;
        }
        break;
      case "cardNumber":
        if (!cardRegex.test(newData[key])) {
          alert("Приклад номеру карты: ХХХХ-ХХХХ-ХХХХ-ХХХХ");
          isValidInfo = false;
        }
        break;
    }
  }

  if (isValidInfo) {
    getUsers[index - 1] = newData;
    localStorage.setItem("DataCenter", JSON.stringify(getUsers));

    row.cells[0].innerHTML = newData.person;
    row.cells[1].innerHTML = newData.password;
    row.cells[2].innerHTML = newData.age;
    row.cells[3].innerHTML = newData.email;
    row.cells[4].innerHTML = newData.phoneNumber;
    row.cells[5].innerHTML = newData.cardNumber;
  }
}

//Функция для удаление информации из таблицы и одновременно LocalStorage
function deleteInfo(event) {
  const deleteButton = event.target.getAttribute("data-index");
  const index = deleteButton - 1;

  getUsers.splice(index, 1);
  localStorage.setItem("DataCenter", JSON.stringify(getUsers));
  
  const row = document.querySelector(`tr[data-index="${deleteButton}"]`)
  if(row) {
    row.remove()
  }

}




