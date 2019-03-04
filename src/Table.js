import React, { Component } from "react";
import "./Table.css";
import Select from "react-select";

class StudentsLine extends Component {
  constructor(props) {
    super(props);

    let studentsComponents = this.props.students.map(item => {
      return <div className="cell">{item.github}</div>;
    });

    this.state = { studentsComponents: studentsComponents };
    this.rerender = this.rerender.bind(this);
  }
  rerender() {
    let studentsComponents = this.props.students.map(item => {
      return <div className="cell">{item.github}</div>;
    });
    this.state.studentsComponents = studentsComponents;
  }
  render() {
    this.rerender();
    return <div className="studentsLine">{this.state.studentsComponents}</div>;
  }
}

class TasksLines extends Component {
  constructor(props) {
    super(props);

    let lines = this.props.tasks.map(item => {
      let taskName = item.name;
      let result, color;

      let marks = this.props.students.map(item => {
        if (item[taskName] !== undefined) {
          if (item[taskName].indexOf("/") >= 0) {
            result = item[taskName].slice(item[taskName].indexOf("/") + 1);
            color = "rgb(152, 233, 177)";
          } else {
            result = item[taskName];
            if (result === "Failed") {
              color = "rgb(179, 15, 15)";
            } else if (result === "Checking") {
              color = "rgb(228, 233, 152)";
            } else if (result === "In Progress") {
              color = "rgb(232, 103, 120)";
            } else if (result === "ToDo") {
              color = "rgb(212, 209, 209)";
            }
            result = "-";
          }
        } else {
          result = "Failed";
        }

        return (
          <div className="cell" style={{ backgroundColor: `${color}` }}>
            {" "}
            {result}{" "}
          </div>
        );
      });

      return (
        <div className="line">
          <div className="taskName">{taskName}</div>
          {marks}
        </div>
      );
    });

    this.state = { lines: lines };
    this.rerender = this.rerender.bind(this);
  }

  rerender() {
    let lines = this.props.tasks.map(item => {
      let taskName = item.name;
      let result, color;

      let marks = this.props.students.map(item => {
        if (item[taskName] !== undefined) {
          if (item[taskName].indexOf("/") >= 0) {
            result = item[taskName].slice(item[taskName].indexOf("/") + 1);
            color = "rgb(152, 233, 177)";
          } else {
            result = item[taskName];
            if (result === "Failed") {
              color = "rgb(179, 15, 15)";
            } else if (result === "Checking") {
              color = "rgb(228, 233, 152)";
            } else if (result === "In Progress") {
              color = "rgb(232, 103, 120)";
            } else if (result === "ToDo") {
              color = "rgb(212, 209, 209)";
            }
            result = "-";
          }
        } else {
          result = "Failed";
        }

        return (
          <div className="cell" style={{ backgroundColor: `${color}` }}>
            {" "}
            {result}{" "}
          </div>
        );
      });

      return (
        <div className="line">
          <div className="taskName">{taskName}</div>
          {marks}
        </div>
      );
    });
    this.state.lines = lines;
  }
  render() {
    this.rerender();
    return <div className="results">{this.state.lines}</div>;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMentor: `${0}`,
      selectedOption: null
    };

    const options = this.props.data.mentors.map((mentor, i) => {
      return { value: mentor.fullName, label: mentor.fullName, number: i };
    });

    this.state.options = options;
  }

  handleChange = selectedOption => {
    console.log(selectedOption);
    this.setState({
      selectedOption: selectedOption,
      currentMentor: `${selectedOption.number}`
    });
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <div className="wrapper">
        <div className="table">
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={this.state.options}
          />

          <div className="innerTable">
            <StudentsLine
              students={
                this.props.data.mentors[`${this.state.currentMentor}`].students
              }
            />
            <TasksLines
              students={
                this.props.data.mentors[`${this.state.currentMentor}`].students
              }
              tasks={this.props.data.tasks}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
