import Icon from "./Icon";

export default function TaskCard({ task, handleDragStart, grouping }) {
  console.log(task);
  return (
    <div
      className={`task-card ${grouping === "status" && "pointer-move"}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <div className="task-header">
        <div className="flex">
        <img
          src={`priority-${task.priority}.svg`}
          alt={`Priority ${task.priority}`}
        />
        <span className="task-id">{task.id}</span>
        </div>
        <img
          src={`/Avatar.svg`}
          alt="Assignee"
          className="task-assignee"
        />
      </div>
      <h3 className="task-title flex">
        <Icon status={task.status} />
        {task.title}
        {task.details && <p className="task-details">{task.details}</p>}
      </h3>
      <div className="task-footer">
        <div className="task-tag">
          <span>{task.tag[0]}</span>
        </div>
      </div>
    </div>
  );
}
