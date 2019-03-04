
let fs = require('fs');

function createTaskList(path) {
  const xlsx = require("node-xlsx").default;
  let data = {
    tasks: []
  };

  let xlsxParsedObject = xlsx.parse(`${path}`);
  for (let i = 1; i < xlsxParsedObject[0].data.length; i += 1) {
    data.tasks.push({});
    let name = xlsxParsedObject[0].data[i][0];
    if (name === 'CodeJam "Scoreboard"') name = 'Code Jam "Scoreboard"';
    if (name === 'Code Jam "DOM, DOM Events" ')
      name = 'Code Jam "DOM, DOM Events"';
    if (name === 'Code Jam "CoreJS" ') name = 'Code Jam "CoreJS"';
    data.tasks[i - 1].name = name;
    data.tasks[i - 1].github = xlsxParsedObject[0].data[i][1];
    data.tasks[i - 1].status = xlsxParsedObject[0].data[i][2];
  }
  let presentation = [];
  presentation.name = "Presentation";
  presentation.status = "Checked";
  presentation.github =
    "https://github.com/rolling-scopes-school/tasks/blob/2018-Q3/tasks/presentation.md";

  data.tasks.push(presentation);
  return data;
}
let tasks = createTaskList("./src/data/Tasks.xlsx");


function createPairsList(path) {
  const xlsx = require("node-xlsx").default;

  let data = {
    mentors: []
  };

  let xlsxParsedObject = xlsx.parse(`${path}`);
  let mentorList = [];

  //Создание уникального списка менторов
  for (let i = 1; i < xlsxParsedObject[0].data.length; i += 1) {
    mentorList.push(xlsxParsedObject[0].data[i][0]);
  }
  mentorList = Array.from(new Set(mentorList));

  //И его добавление в 'data'
  for (let i = 0; i < mentorList.length; i += 1) {
    data.mentors[i] = {
      fullName: mentorList[i],
      city: "no_data",
      github: "no_data"
    };
  }

  //Добавление списка студентов к каждому ментору
  for (let i = 0; i < data.mentors.length; i += 1) {
    data.mentors[i].students = [];
    for (let j = 0; j < xlsxParsedObject[0].data.length; j += 1) {
      if (data.mentors[i].fullName === xlsxParsedObject[0].data[j][0]) {
        let studentDataObj = {
          github: xlsxParsedObject[0].data[j][1]
        };
        data.mentors[i].students.push(studentDataObj);
      }
    }
  }

  //Добавление информации о менторе
  for (let i = 0; i < data.mentors.length; i += 1) {
    for (let j = 0; j < xlsxParsedObject[1].data.length; j += 1) {
      let fullName =
        xlsxParsedObject[1].data[j][0] + " " + xlsxParsedObject[1].data[j][1];
      if (data.mentors[i].fullName === fullName) {
        data.mentors[i].github = xlsxParsedObject[1].data[j][4];
        data.mentors[i].city = xlsxParsedObject[1].data[j][2];
      }
    }
  }

  return data;
}
let data = createPairsList("./src/data/Mentor_students_pairs.xlsx");

data.tasks = tasks.tasks;

function createTable(path, data,tasks) {
  const xlsx = require("node-xlsx").default;
  let xlsxParsedObject = xlsx.parse(`${path}`);
  let xlsxData = xlsxParsedObject[0].data;
  xlsxData.shift();

  for (let i = 0; i < data.mentors.length; i += 1) {
    for (let j = 0; j < data.mentors[i].students.length; j += 1) {
      for (let k = 0; k < tasks.tasks.length; k += 1) {
        let flag;
        if (tasks.tasks[k].status === "In Progress") flag = "In Progress";
        else if (tasks.tasks[k].status === "Checking") flag = "Checking";
        else if (tasks.tasks[k].status === "ToDo") flag = "ToDo";
        else flag = "Failed";
        data.mentors[i].students[j][tasks.tasks[k].name] = flag;
      }
    }
  }

  for (let i = 0; i < xlsxData.length; i += 1) {
    let studentGit = xlsxData[i][2].slice(19);
    let taskName = xlsxData[i][3];
    let score = xlsxData[i][5];
    let status;
    let timeStatus;

    for (let i = 0; i < tasks.tasks.length; i += 1) {
      if (taskName === tasks.tasks[i].name) timeStatus = tasks.tasks[i].status;
    }

    if (xlsxData[i][5] > 0) status = timeStatus;
    else status = "failed/0";
    status = status + "/" + score;

    for (let j = 0; j < data.mentors.length; j += 1) {
      for (let k = 0; k < data.mentors[j].students.length; k += 1) {
        if (data.mentors[j].students[k].github === studentGit) {
          data.mentors[j].students[k][`${taskName}`] = status;
        }
      }
    }
  }

  return data;
}

let TableJson = JSON.stringify(createTable("./src/data/Mentor_score.xlsx",data,tasks));

fs.writeFile('./src/parcedData.js', TableJson);
