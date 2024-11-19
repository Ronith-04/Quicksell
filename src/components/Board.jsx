import { useEffect, useState } from "react";
import { apiEndPoint, ticketsLocStorageKey, usersLocStorageKey } from "../constants";
import Columns from "./Columns";
import Navbar from "./Navbar";

export default function Board() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem(ticketsLocStorageKey)) || []
  );
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem(usersLocStorageKey)) || []
  );
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("title");
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    if (tasks.length > 0 && users.length > 0) return;

    const fetchData = async () => {
      try {
        const response = await fetch(apiEndPoint);
        const data = await response.json();
        setTasks(data.tickets);
        setUsers(data.users);
        localStorage.setItem(ticketsLocStorageKey, JSON.stringify(data.tickets));
        localStorage.setItem(usersLocStorageKey, JSON.stringify(data.users));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  });

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
      setTasks(sortTasks(updatedTasks));
      setDraggedTask(null);
    }
  };

  const sortTasks = (arr) => {
    return [...arr].sort((a, b) => {
      if (ordering === "priority") return b.priority - a.priority;
      if (ordering === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  };

  useEffect(() => {
    setTasks((prevTasks) => sortTasks(prevTasks));
  }, [ordering]);

  return (
    <div className="board">
      <Navbar
        displayMenuOpen={displayMenuOpen}
        setDisplayMenuOpen={setDisplayMenuOpen}
        grouping={grouping}
        setGrouping={setGrouping}
        ordering={ordering}
        setOrdering={setOrdering}
      />
      <Columns
        tasks={tasks}
        users={users}
        grouping={grouping}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      />
    </div>
  );
}
