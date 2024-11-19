export default function Icon({ status }) {
  switch (status) {
    case "Todo":
      return <img src="To-do.svg" alt="todo" />

    case "In progress":
      return <img src="In-progress.svg" alt="in-progress" />

    case "Done":
      return <img src="Done.svg" alt="done" />
    
    case "Canceled":
      return <img src="Cancelled.svg" alt="canceled" />

    default:
      return <img src="Backlog.svg" alt="backlog" />
  }
}