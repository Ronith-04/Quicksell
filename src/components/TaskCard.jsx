import React from "react";
import Icon from "./Icon";

export default function TaskCard({ task, handleDragStart, grouping, users }) {
  const user = users.find((u) => u.id === task.userId);

  const getUserIcon = (user) => {
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
  };

  return (
    <div
      className={`task-card ${grouping === "status" && "pointer-move"}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <div className="task-header">
        <div className="flex">
          <span className="task-id">{task.id}</span>
        </div>
        <div className="task-assignee">
          {user && getUserIcon(user)}
        </div>
      </div>

      <h3 className="task-title flex">
        <Icon status={task.status} />
        {task.title}
        {task.details && <p className="task-details">{task.details}</p>}
      </h3>

      <div className="task-footer flex">
        <img
          src={`priority-${task.priority}.svg`}
          alt={`Priority ${task.priority}`}
          className="priority-icon"
        />
        <div className="task-tag">
          <span>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                backgroundColor: "rgba(128, 128, 128, 0.6)",
                borderRadius: "50%",
                marginRight: "5px",
              }}
            ></span>
            {task.tag[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
