import React from "react";

import Item from "./items";
class TaskList extends React.Component {
  constructor(params) {
    super(params);
    this.state = {
      filterName: "",
      filterStatus: -1,
    };
  }
  onChange = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.props.onFilter(
      name === "filterName" ? value : this.state.filterName,
      name === "filterStatus" ? value : this.state.filterStatus
    );
    this.setState({
      [name]: value,
    });
  };
  render() {
    var { task } = this.props;
    var { filterName, filterStatus } = this.state;
    var element = task.map((task, index) => {
      return (
        <Item
          onUpdateStatus={this.props.onUpdateStatus}
          onDelete={this.props.onDelete}
          onUpdate={this.props.onUpdate}
          key={task.id}
          index={index}
          task={task}
        />
      );
    });
    return (
      <div className="row mt-5">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">STT</th>
                <th className="text-center">Tên</th>
                <th className="text-center">Trạng Thái</th>
                <th className="text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="filterName"
                    onChange={this.onChange}
                    value={filterName}
                  />
                </td>
                <td>
                  <select
                    name="filterStatus"
                    onChange={this.onChange}
                    value={filterStatus}
                    className="form-control"
                  >
                    <option value="-1">Tất Cả</option>
                    <option value="0">Ẩn</option>
                    <option value="1">Kích Hoạt</option>
                  </select>
                </td>
                <td></td>
              </tr>
              {element}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TaskList;
