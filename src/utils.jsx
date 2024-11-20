import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaTasks } from "react-icons/fa";

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getUserNameById(userId, users) {
  const user = users.find((u) => u.id === userId);
  return user ? user.name : "Unknown User"; // 
}

export function getStatusIcon(status) {
  const statusIcons = {
    Todo: <FaTasks style={{ color: "#6c757d" }} />, // Gray
    "In progress": <FaHourglassHalf style={{ color: "#ffc107" }} />, // Yellow
    Done: <FaCheckCircle style={{ color: "#28a745" }} />, // Green
    Canceled: <FaTimesCircle style={{ color: "#dc3545" }} />, // Red
  };

  return statusIcons[status] || null;
}


