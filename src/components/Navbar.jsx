import { capitalize } from "../utils";

export default function Navbar({
  displayMenuOpen,
  setDisplayMenuOpen,
  grouping,
  setGrouping,
  ordering,
  setOrdering,
}) {
  return (
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
                    if (grouping === "priority" && e.target.value === "priority") {
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
  );
}
