import TaskCard from "./TaskCard";

// Utility function to map priority levels to labels
function getPriorityLabel(priority) {
  const priorityMap = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No Priority",
  };

  return priorityMap[priority] || "Unknown Priority"; // Default for unexpected values
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

  return (
    <div className="columns">
      {Object.entries(groupedTasks[grouping]).map(([group, groupTasks]) => (
        <div
          key={group}
          className="column"
          onDragOver={grouping === "status" ? handleDragOver : undefined}
          onDrop={(e) => grouping === "status" && handleDrop(e, group)}
        >
          <div className="column-header">
            <div className="header-left">
              <span className="status-name">
                {grouping === "priority"
                  ? getPriorityLabel(group) // Use the utility function for priority labels
                  : group}
              </span>
              <span className="task-count">{groupTasks.length}</span>
            </div>
          </div>
          <div className="tasks-container">
            {groupTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                handleDragStart={handleDragStart}
                grouping={grouping}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
