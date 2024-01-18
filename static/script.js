function toggleTopicField() {
  var reportCheckbox = document.getElementById("report");
  var topicField = document.getElementById("topicField");
  if (reportCheckbox.checked) {
    topicField.style.display = "block";
  } else {
    topicField.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var registrationForm = document.getElementById("registrationForm");

  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var fullName = document.getElementById("fullName").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var sectionElement = document.getElementById("section");
    var sectionValue =
      sectionElement.options[sectionElement.selectedIndex].value;
    var birthdate = document.getElementById("birthdate").value;
    var report = document.getElementById("report").checked;
    var topic = report ? document.getElementById("topic").value : null;

    var dataToSend = {
      FullName: fullName,
      Phone: phone,
      Email: email,
      Section: convertSectionToNumber(sectionValue),
      Date: birthdate || null,
      HasReport: report,
      ReportName: topic || null,
    };

    fetch("http://localhost:8080/insertData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.result) {
          showModal(dataToSend);
        } else {
          alert("Эти данные уже существуют.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

function showModal(data) {
  // Создать элементы модального окна
  const modal = document.createElement("div");
  const modalContent = document.createElement("div");
  const closeButton = document.createElement("span");
  const info = document.createElement("div");

  modal.className = "modal";
  modalContent.className = "modal-content";
  closeButton.className = "close-button";
  info.className = "info";

  closeButton.innerText = "×";
  closeButton.onclick = function () {
    modal.style.display = "none";
    clearForm();
  };
  info.innerHTML = `
    <p>Имя: ${data.FullName}</p>
    <p>Телефон: ${data.Phone}</p>
    <p>Email: ${data.Email}</p>
    <p>Секция: ${getSubjectName(data.Section)}</p>
    ${data.HasReport ? `<p>Дата: ${data.ReportName}</p>` : ""}
    <p>Отчет: ${data.HasReport ? "Да" : "Нет"}</p>
    ${data.HasReport ? `<p>Название отчета: ${data.ReportName}</p>` : ""}
  `;

  modalContent.appendChild(closeButton);
  modalContent.appendChild(info);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
  modal.style.display = "block";
}

function clearForm() {
  var registrationForm = document.getElementById("registrationForm");
  var formSecond = document.getElementById("topicField");
  formSecond.style.display = "none";
  registrationForm.reset();
}

function convertSectionToNumber(sectionText) {
  const sections = {
    Математика: 0,
    Физика: 1,
    Информатика: 2,
  };
  return sections[sectionText] || 0;
}

function onBlurFun() {
  var fullNameElement = document.getElementById("fullName");
  var fullName = { name: fullNameElement.value };

  fetch("http://localhost:8080/checkNameForExist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fullName),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.result) {
        alert("Имя уже существует");
        fullNameElement.value = "";
        fullNameElement.focus();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function onFirstScreenLoad() {
  var registrationForm = document.getElementById("registrationForm");
  var listContainer = document.getElementById("personList");
  listContainer.style.display = "none";
  registrationForm.style.display = "block";
}

function onSecondScreenLoad() {
  var registrationForm = document.getElementById("registrationForm");
  var listContainer = document.getElementById("personList");
  registrationForm.style.display = "none";
  listContainer.style.display = "block";

  listContainer.innerHTML = "";

  fetch("http://localhost:8080/getAllRecords", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach(function (item) {
        var listItem = document.createElement("div");
        listItem.className = "person-item";
        listItem.innerHTML = `
        <h2>${item.FullName}</h2>
        <p>Телефон: ${item.Phone}</p>
        <p>Email: ${item.Email}</p>
        <p>Секция: ${getSubjectName(item.Section)}</p>
        ${item.Date ? `<p>Дата: ${item.Date}</p>` : ""}
        <p>Есть отчёт: ${item.HasReport ? "Да" : "Нет"}</p>
        ${item.HasReport ? `<p>Название отчёта: ${item.ReportName}</p>` : ""}
      `;
        listContainer.appendChild(listItem);
      });
    });
}

function getSubjectName(subjectNumber) {
  const subjects = {
    0: "Математика",
    1: "Физика",
    2: "Информатика",
  };

  return subjects[subjectNumber] || "Неизвестный предмет";
}
