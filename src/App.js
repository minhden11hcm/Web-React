import React from "react";
import TaskForm from "./conponents/Taskform";
import Control from "./conponents/control";
import TaskList from "./conponents/TaskList";
import "./App.css";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: [], // id: độc nhất, name, status
      isDisplay: false,
      taskEdit: null,
      filter: { name: "", status: -1 },
      keyword: "",
      sortBy: "name",
      value: 1,
    };

    this.click = this.click.bind(this);
  }

  click() {
    if (this.state.isDisplay && this.state.taskEdit !== null) {
      this.setState({ isDisplay: true, taskEdit: null });
    } else {
      this.setState({ isDisplay: !this.state.isDisplay, taskEdit: null });
    }
  }

  componentDidMount() {
    if (localStorage && localStorage.getItem("tasks")) {
      var task = JSON.parse(localStorage.getItem("tasks"));
      this.setState({ task: task });
    }
  }

  onCloseForm = () => {
    this.setState({ isDisplay: !this.state.isDisplay });
  };
  onShow = () => {
    this.setState({ isDisplay: true });
  };
  onSubmit = (data) => {
    var { task } = this.state;
    if (data.id === "") {
      data.id = this.makeID(10);
      task.push(data);
    } else {
      var index = this.findIndex(data.id);
      task[index] = data;
    }

    this.setState({
      task: task,
      taskEdit: null,
    });
    localStorage.setItem("tasks", JSON.stringify(task));
  };
  makeID(len) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  onUpdateStatus = (id) => {
    var { task } = this.state;
    var index = this.findIndex(id);
    if (index !== -1) {
      task[index].status = !task[index].status;
      this.setState({ task: task });
    }
    localStorage.setItem("tasks", JSON.stringify(task));
  };

  findIndex = (id) => {
    var { task } = this.state;
    var result = -1;
    task.forEach((tasks, index) => {
      if (tasks.id === id) {
        result = index;
      }
    });
    return result;
  };

  onDelete = (id) => {
    var { task } = this.state;
    var index = this.findIndex(id);
    if (index !== -1) {
      task.splice(index, 1);
      this.setState({ task: task });
    }
    localStorage.setItem("tasks", JSON.stringify(task));
    this.onCloseForm();
  };

  onUpdate = (id) => {
    var { task } = this.state;
    var index = this.findIndex(id);
    var taskEdit = task[index];

    this.setState({
      taskEdit: taskEdit,
    });
    this.onShow();
    console.log(this.state.taskEdit);
  };

  onFilter = (filterName, filterStatus) => {
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filter: {
        name: filterName.toLowerCase(),
        status: filterStatus,
      },
    });
  };

  onSearch = (keyword) => {
    this.setState({
      keyword: keyword,
    });
  };

  onSort = (sortBy, sortValue) => {
    this.setState({
      sortBy: sortBy,
      value: sortValue,
    });
    
  };

  render() {
    var sortBy = this.state.sortBy;
    var sortValue = this.state.value;
    var filter = this.state.filter;
    var task = this.state.task;
    var isDisplay = this.state.isDisplay;
    var taskEdit = this.state.taskEdit;
    var keyword = this.state.keyword;
    var element = isDisplay ? (
      <TaskForm
        task={taskEdit}
        onSubmit={this.onSubmit}
        onCloseForm={this.onCloseForm}
      />
    ) : (
      ""
    );
    if (filter) {
      if (filter.name) {
        task = task.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      task = task.filter((task) => {
        if (filter.status === -1) {
          return task;
        } else {
          return task.status === (filter.status === 1 ? true : false);
        }
      });
    }
    if (keyword) {
      task = task.filter((task) => {
        return task.name.toLowerCase().indexOf(filter.name) !== -1;
      });
    }
    if(sortBy === 'name'){
      task.sort((a,b)=>{
          if(a.name>b.name) return sortValue;
          else if(a.name<b.name) return -sortValue;
          else return 0
      })
    }
    else{
      task.sort((a,b)=>{
        if(a.status>b.status) return -sortValue;
        else if(a.status<b.status) return sortValue;
        else return 0
    })
    }
    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row mt-5">
          <div
            className={isDisplay ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : ""}
          >
            {element}
          </div>
          <div
            className={
              isDisplay
                ? "col-xs-8 col-sm-8 col-md-8 col-lg-8 "
                : "col-xs-12 col-sm-12 col-md-12 col-lg-12 "
            }
          >
            <button
              type="button"
              className="btn btn-primary mr-5"
              onClick={this.click}
            >
              <span className="fa fa-plus mr-5 "></span>Thêm Công Việc
            </button>

            {/* tìm kiếm */}
            <Control
              onSearch={this.onSearch}
              onSort={this.onSort}
              sortBy={sortBy}
              sortValue={sortValue}
            />
            <br></br>
            <TaskList
              onUpdateStatus={this.onUpdateStatus}
              onDelete={this.onDelete}
              onUpdate={this.onUpdate}
              onFilter={this.onFilter}
              task={task}
            ></TaskList>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
