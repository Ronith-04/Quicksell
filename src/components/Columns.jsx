import React from "react";
import TaskCard from "./TaskCard";
import { getUserNameById } from "../utils.jsx";

import plusIcon from "../assets/icons/add.svg";
import menuIcon from "../assets/icons/menu.svg";
import urgentIcon from "../assets/icons/urgent.svg";
import highIcon from "../assets/icons/high.svg";
import mediumIcon from "../assets/icons/medium.svg";
import lowIcon from "../assets/icons/low.svg";
import noPriorityIcon from "../assets/icons/no-priority.svg";

import todoIcon from "../assets/icons/To-do.svg";
import inProgressIcon from "../assets/icons/in-progress.svg";
import doneIcon from "../assets/icons/done.svg";
import canceledIcon from "../assets/icons/Cancelled.svg";

function getPriorityDetails(priority) {
  const priorityMap = {
    4: { label: "Urgent", icon: urgentIcon },
    3: { label: "High", icon: highIcon },
    2: { label: "Medium", icon: mediumIcon },
    1: { label: "Low", icon: lowIcon },
    0: { label: "No Priority", icon: noPriorityIcon },
  };
  return priorityMap[priority] || { label: "Unknown Priority", icon: noPriorityIcon };
}

function getStatusDetails(status) {
  const statusMap = {
    Todo: { label: "To Do", icon: todoIcon },
    "In progress": { label: "In Progress", icon: inProgressIcon },
    Done: { label: "Completed", icon: doneIcon },
    Canceled: { label: "Canceled", icon: canceledIcon },
  };
  return statusMap[status] || { label: "Unknown Status", icon: todoIcon };
}

function getUserIcon(user) {
  const initials = user.name.split(" ").map((word) => word[0]).join("");
  return (
    <div
      style={{
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: "#4caf50",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "8px",
        position: 'relative',
      }}
    >
      {initials}
      <span
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '3px',
          height: '3px',
          backgroundColor: user.available === true ? '#FFB84D' : 'grey',
          borderRadius: '50%',
          border: '1px solid white',
        }}
      ></span>
    </div>
  );
}

export default function Columns({
  tasks,
  users,
  grouping,
  handleDragStart,
  handleDragOver,
  handleDrop,
}) {
  const groupedTasks = {
    status: {
      Todo: tasks.filter((t) => t.status === "Todo"),
      "In progress": tasks.filter((t) => t.status === "In progress"),
      Done: tasks.filter((t) => t.status === "Done"),
      Canceled: tasks.filter((t) => t.status === "Canceled"),
    },
    user: Object.fromEntries(
      users.map((user) => [user.id, tasks.filter((task) => task.userId === user.id)])
    ),
    priority: tasks.reduce((acc, task) => {
      if (!acc[task.priority]) acc[task.priority] = [];
      acc[task.priority].push(task);
      return acc;
    }, {}),
  };

  const styles = {
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    icon: {
      width: "12px",
      height: "12px",
      cursor: "pointer",
    },
    priorityIcon: {
      width: "14px",
      height: "14px",
    },
    columnHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 16px",
      borderBottom: "1px solid #ddd",
    },
    userIcon: {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: "#4caf50",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "8px",
      fontWeight: "bold",
    },
  };

  return (
    <div className="columns">
      {Object.entries(groupedTasks[grouping]).map(([group, groupTasks]) => (
        <div
          key={group}
          className="column"
          onDragOver={grouping === "status" ? handleDragOver : undefined}
          onDrop={(e) => grouping === "status" && handleDrop(e, group)}
        >
          <div className="column-header" style={styles.columnHeader}>
            <div className="header-left" style={styles.headerLeft}>
              {grouping === "status" && (
                <img
                  src={getStatusDetails(group).icon}
                  alt={getStatusDetails(group).label}
                  style={styles.icon}
                />
              )}
              {grouping === "priority" && (
                <img
                  src={getPriorityDetails(group).icon}
                  alt={getPriorityDetails(group).label}
                  style={styles.priorityIcon}
                />
              )}
              {grouping === "user" && (
                <>
                  {getUserIcon(users.find((user) => user.id === group))}
                </>
              )}
              <span className="status-name">
                {grouping === "priority"
                  ? getPriorityDetails(group).label
                  : grouping === "user"
                  ? getUserNameById(group, users)
                  : getStatusDetails(group).label}
              </span>
              <span className="task-count">({groupTasks.length})</span>
            </div>

            <div className="header-right" style={styles.headerRight}>
              <img
                src={plusIcon}
                alt="Add"
                style={styles.icon}
                onClick={() => alert(`Add clicked for group: ${group}`)}
              />
              <img
                src={menuIcon}
                alt="Menu"
                style={styles.icon}
                onClick={() => alert(`Menu clicked for group: ${group}`)}
              />
            </div>
          </div>

          <div className="tasks-container">
            {groupTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                handleDragStart={handleDragStart}
                grouping={grouping}
                users={users}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
