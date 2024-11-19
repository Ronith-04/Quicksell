import { useEffect, useState } from "react";
import {
  apiEndPoint,
  ticketsLocStorageKey,
  usersLocStorageKey,
} from "../constants";
import { capitalize } from "../utils";

export default function Component() {
  const [tasks, setTasks] = useState(
    localStorage.getItem(ticketsLocStorageKey)
      ? JSON.parse(localStorage.getItem(ticketsLocStorageKey))
      : []
  );
  const [users, setUsers] = useState(
    localStorage.getItem(usersLocStorageKey)
      ? JSON.parse(localStorage.getItem(usersLocStorageKey))
      : []
  );
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");

  useEffect(() => {
    if (
      localStorage.getItem(ticketsLocStorageKey) &&
      localStorage.getItem(usersLocStorageKey)
    ) {
      return;
    }
    const fetchData = async () => {
      try {
        const responseData = await fetch(apiEndPoint);
        const data = await responseData.json();
        console.log(data);
        setTasks(data.tickets);
        setUsers(data.users);
        localStorage.setItem(usersLocStorageKey, JSON.stringify(data.users));
      } catch (err) {
        throw new Error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem(ticketsLocStorageKey, JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTask.id ? { ...task, status: targetStatus } : task
      );
      setTasks(customSort(updatedTasks));
      setDraggedTask(null);
    }
  };

  const customSort = (arr) => {
    const sortedArr = [...arr].sort((a, b) => {
      if (ordering === "priority") {
        return b.priority - a.priority;
      }
      if (ordering === "title") {
        return a.title.localeCompare(b.title);
      }
    });
    return sortedArr;
  };

  const groupedTasks = {
    Todo: tasks.filter((t) => t.status === "Todo"),
    "In progress": tasks.filter((t) => t.status === "In progress"),
    Done: tasks.filter((t) => t.status === "Done"),
    Canceled: tasks.filter((t) => t.status === "Canceled"),
  };

  let userGroupedTasks = {};

  users.forEach((user) => {
    userGroupedTasks[user.id] = tasks.filter((task) => task.userId === user.id);
  });

  useEffect(() => {
    setTasks((t) => customSort(t));
  }, [ordering]);

  let priorityGroupedTasks = {};

  tasks.forEach((task) => {
    if (!priorityGroupedTasks[task.priority]) {
      priorityGroupedTasks[task.priority] = [];
    }
    priorityGroupedTasks[task.priority].push(task);
  });

  return (
    <div className="board">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="dropdown-container">
            <button
              className="nav-button"
              onClick={() => setDisplayMenuOpen(!displayMenuOpen)}
            >
              <span>Display</span>
              <img src="down.svg" alt="Down" />
            </button>
            {displayMenuOpen && (
              <div className="display-menu">
                <div className="menu-group">
                  <label>Grouping</label>
                  <select
                    value={grouping}
                    onChange={(e) => {
                      setGrouping(e.target.value);
                      setDisplayMenuOpen(false);
                    }}
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div className="menu-group">
                  <label>Ordering</label>
                  <select
                    value={ordering}
                    onChange={(e) => {
                      if (
                        grouping === "priority" &&
                        e.target.value === "priority"
                      ) {
                        alert(
                          "Priority ordering is not supported with priority grouping"
                        );
                        setDisplayMenuOpen(false);
                        return;
                      }
                      setOrdering(e.target.value);
                      setDisplayMenuOpen(false);
                    }}
                  >
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <p className="task-title">
            Grouped by:
            <span className="mono-tag">{capitalize(grouping)}</span>
          </p>
          <p className="task-title">
            Sorted by:
            <span className="mono-tag">{capitalize(ordering)}</span>
          </p>
        </div>
      </nav>

      {grouping === "status" && (
        <div className="columns">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div
              key={status}
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="column-header">
                <div className="header-left">
                  <span className="status-name">{status}</span>
                  <span className="task-count">{statusTasks.length}</span>
                </div>
                <div className="header-right">
                  <button className="icon-button">
                    {status === "Todo" && <img src="To-do.svg" alt="todo" />}
                    {status === "In progress" && (
                      <img src="in-progress.svg" alt="In progress" />
                    )}
                    {status === "Done" && <img src="Done.svg" alt="done" />}
                    {status === "Canceled" && (
                      <img src="Cancelled.svg" alt="canceled" />
                    )}
                  </button>
                </div>
              </div>
              <div className="tasks-container">
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-card pointer-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="task-header">
                      <span className="task-id">
                        {task.id} {` | `}
                        {task.priority == "0" && (
                          <img src="No-priority.svg" alt="zero" />
                        )}
                        {task.priority == "1" && (
                          <img src="Img-LowPriority.svg" alt="low" />
                        )}
                        {task.priority == "2" && (
                          <img src="Img-MediumPriority.svg" alt="medium" />
                        )}
                        {task.priority == "3" && (
                          <img src="Img-HighPriority.svg" alt="high" />
                        )}
                        {task.priority > "3" && (
                          <img
                            src="SVG-UrgentPrioritycolour.svg"
                            alt="urgent"
                          />
                        )}
                      </span>

                      <img
                        src={`/placeholder.svg?height=16&width=16&text=${task.userId}`}
                        alt="Assignee"
                        className="task-assignee"
                      />
                    </div>
                    <h3 className="task-title">
                      {task.title}
                      {task.details && (
                        <span className="task-details">{task.details}</span>
                      )}
                    </h3>
                    <div className="task-footer">
                      <div className="task-tag">
                        <span>{task.tag[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {grouping === "user" && (
        <div className="columns">
          {Object.entries(userGroupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="column">
              <div className="column-header">
                <div className="header-left">
                  <span className="status-name">{status}</span>
                  <span className="task-count">{statusTasks.length}</span>
                </div>
              </div>
              <div className="tasks-container">
                {statusTasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <span className="task-id">
                        {task.id} {` | `}
                        {task.priority == "0" && (
                          <img src="No-priority.svg" alt="zero" />
                        )}
                        {task.priority == "1" && (
                          <img src="Img-LowPriority.svg" alt="low" />
                        )}
                        {task.priority == "2" && (
                          <img src="Img-MediumPriority.svg" alt="medium" />
                        )}
                        {task.priority == "3" && (
                          <img src="Img-HighPriority.svg" alt="high" />
                        )}
                        {task.priority > "3" && (
                          <img
                            src="SVG-UrgentPrioritycolour.svg"
                            alt="urgent"
                          />
                        )}
                      </span>

                      <img
                        src={`/placeholder.svg?height=16&width=16&text=${task.userId}`}
                        alt="Assignee"
                        className="task-assignee"
                      />
                    </div>
                    <h3 className="task-title">
                      {task.title}
                      {task.details && (
                        <span className="task-details">{task.details}</span>
                      )}
                    </h3>
                    <div className="task-footer">
                      <div className="task-tag">
                        <span className="tag-dots"></span>
                        <span>{task.tag[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {grouping === "priority" && (
        <div className="columns">
          {Object.entries(priorityGroupedTasks).map(
            ([priority, priorityTasks]) => (
              <div key={priority} className="column">
                <div className="column-header">
                  <div className="header-left">
                    <span className="status-name">Priority: {priority}</span>
                    <span className="task-count">{priorityTasks.length}</span>
                  </div>
                </div>
                <div className="tasks-container">
                  {priorityTasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <span className="task-id">
                          {task.id} {` | `}
                          {task.priority == "0" && (
                            <img src="No-priority.svg" alt="zero" />
                          )}
                          {task.priority == "1" && (
                            <img src="Img-LowPriority.svg" alt="low" />
                          )}
                          {task.priority == "2" && (
                            <img src="Img-MediumPriority.svg" alt="medium" />
                          )}
                          {task.priority == "3" && (
                            <img src="Img-HighPriority.svg" alt="high" />
                          )}
                          {task.priority > "3" && (
                            <img
                              src="SVG-UrgentPrioritycolour.svg"
                              alt="urgent"
                            />
                          )}
                        </span>

                        <img
                          src={`/Avatar.svg`}
                          alt="Assignee"
                          className="task-assignee"
                        />
                      </div>
                      <h3 className="task-title">
                        {task.title}
                        {task.details && (
                          <span className="task-details">{task.details}</span>
                        )}
                      </h3>
                      <div className="task-footer">
                        <div className="task-tag">
                          <span>{task.tag[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
