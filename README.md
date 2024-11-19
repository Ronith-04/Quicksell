# Frontend Assignment

As a person who knows the importance of documentation, I have clearly liated out the working of the application and a shallow dive of my thought process of the way I implemented it. I have levaraged the use of AI to enhace code reuse and reduce redundancy. Left the actual `Kanban.jsx` in the components folder for a peek of crude implementation.

## Task Management Board Application

This repository contains a React application for a drag-and-drop task management board. Tasks can be grouped by **status**, **user**, or **priority**, and sorted by **priority** or **title**. The app fetches task and user data, persists it locally, and updates task statuses dynamically through drag-and-drop interactions.

---

## Features

- **Dynamic Grouping**: 
  - Group tasks by **status**, **user**, or **priority**.
- **Custom Sorting**: 
  - Sort tasks by **priority** or **title**.
- **Drag-and-Drop Functionality**: 
  - Drag tasks across different status groups (e.g., "Todo" → "In Progress").
- **Data Persistence**: 
  - Uses `localStorage` to persist task and user data across sessions. (Thought of the option to use Session-storage but decided to keep it simple and straight forward)
- **Responsive UI**: 
  - Neatly organized into columns based on grouping criteria.

---

## Code Structure

The code is modular, with components separated into their own files for maintainability and reusability.

### 1. **Main Component (`Board.js`)**

- **Purpose**: Orchestrates the application by managing state, fetching data, and rendering other components.
- **Key Functions**:
  - Fetch task and user data from the API if not already in `localStorage`.
  - Handle drag-and-drop operations to update task statuses.
  - Dynamically sort tasks based on user-selected criteria.
- **State Management**:
  - `tasks`, `users`: Store task and user data.
  - `grouping`: Current grouping method (status, user, or priority).
  - `ordering`: Current sorting method (priority or title).
  - `displayMenuOpen`: Toggles the display options dropdown menu.
  - `draggedTask`: Tracks the task being dragged.

---

### 2. **Navbar Component (`Navbar.js`)**

- **Purpose**: Provides the interface to control grouping and sorting of tasks.
- **Features**:
  - Dropdown menus for grouping and sorting options.
  - Alerts the user if an unsupported combination (e.g., priority grouping + priority sorting) is selected.

---

### 3. **Columns Component (`Columns.js`)**

- **Purpose**: Dynamically renders task groups (columns) based on the selected grouping method.
- **Functionality**:
  - Divides tasks into groups (`status`, `user`, or `priority`).
  - Maps groups into individual columns.
  - Passes drag-and-drop handlers to allow task movements.

---

### 4. **TaskCard Component (`TaskCard.js`)**

- **Purpose**: Represents a single task card.
- **Features**:
  - Displays task details such as ID, title, priority, and assigned user.
  - Draggable for changing task status.

---

## How It Works

1. **Data Fetching**:
   - On initial load, the app fetches task and user data from the API (`apiEndPoint`).
   - Data is stored in `localStorage` to avoid repeated API calls.
2. **Task Grouping**:
   - Tasks are dynamically grouped by `status`, `user`, or `priority` based on the `grouping` state.
3. **Drag-and-Drop**:
   - Tasks can be dragged across status columns. The `status` property of the task is updated on drop.
4. **Sorting**:
   - Tasks are sorted by `priority` (descending) or `title` (alphabetical) based on user selection.

---

## Local Storage Keys

- **`ticketsLocStorageKey`**: Stores the list of tasks.
- **`usersLocStorageKey`**: Stores the list of users.

---

## How to Run the Application

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

4. **Visit in Browser**:
   - Open <http://localhost:5173> to view the app.

---

## File Structure

```plaintext
src/
├── components/
│   ├── Board.js             # Main application logic
│   ├── Navbar.js            # Navbar for grouping and sorting controls
│   ├── Columns.js           # Displays grouped task columns
│   ├── TaskCard.js          # Represents individual tasks
├── constants/
    |-- index.js             # Contains API endpoint and localStorage keys
├── utils.js                 # Utility functions (e.g., string capitalization)
└── rest/of/the/defaults
```

---

## Customization

### API Endpoint
Update the `apiEndPoint` in `constants/index.js` to point to your data source.

### Grouping and Sorting
- Add new grouping or sorting methods by extending the logic in `Board.js`.