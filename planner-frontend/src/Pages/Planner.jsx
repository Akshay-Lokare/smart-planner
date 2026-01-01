import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Planner() {
  const [stateDate, setStartDate] = useState(new Date());

  const [taskName, setTaskName] = useState("");
  const [pickedDate, setPickedDate] = useState(new Date());
  const [taskStatus, setTaskStatus] = useState("In-Progress");

  const [data, setData] = useState([
    { id: 1, name: "Task 1", date: "24-12-25", status: "In-Progress" },
    { id: 2, name: "Task 2", date: "25-12-25", status: "In-Progress" },
    { id: 3, name: "Task 3", date: "26-12-25", status: "In-Progress" },
    { id: 4, name: "Task 4", date: "20-12-25", status: "In-Progress" },
  ]);


  const addTask = () => {
    const formattedDate = `${pickedDate.getDate()}-${pickedDate.getMonth() + 1}-${pickedDate.getFullYear() % 100}`;
    const newTask = { id: data.length + 1, name: taskName, date: formattedDate };

    setData([...data, newTask]);
    setTaskName("");
  }

  const done = (id) => {
    setData(data.map((task) =>
      task.id === id ? { ...task, status: 'done' } : task
    ));
  }


  return (
    <div className='planner-container'>
      <h2>Task Planner</h2>

      <DatePicker
        selected={stateDate}
        onChange={(date) => {
          setStartDate(date);
          setPickedDate(date);
        }}
      />

      <input
        type="text"
        placeholder='Task Name'
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      <button className='add-task' onClick={addTask}>Add Task</button>

      <div className="tasks">
        <h3>Tasks for {pickedDate.toLocaleDateString()}</h3>
        {data
          .filter((task) => {
            const [taskDay, taskMonth, taskYear] = task.date.split("-").map(Number);

            const currentDay = pickedDate.getDate();
            const currentMonth = pickedDate.getMonth() + 1; // adjust zero-based
            const currentYear = pickedDate.getFullYear() % 100; // match "25" format

            return (
              (currentDay === taskDay || currentDay === taskDay - 1 || currentDay === taskDay - 2) &&
              currentMonth === taskMonth &&
              currentYear === taskYear
            );
          })
          .map((task) => (
            <div key={task.id}>
              <p>
                {task.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {task.status}</span>
              </p>
              <label>
                <input
                  type="checkbox"
                  id={`done-${task.id}`}
                  onChange={() => done(task.id)}
                  checked={task.status === 'done'}
                />
                Done
              </label>
            </div>
          ))}
        {data.filter((task) => {
          const [taskDay, taskMonth, taskYear] = task.date.split("-").map(Number);
          const currentDay = pickedDate.getDate();
          const currentMonth = pickedDate.getMonth() + 1;
          const currentYear = pickedDate.getFullYear() % 100;
          return (
            (currentDay === taskDay || currentDay === taskDay - 1 || currentDay === taskDay - 2) &&
            currentMonth === taskMonth &&
            currentYear === taskYear
          );
        }).length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem', fontSize: '0.85rem' }}>
              No tasks for this date
            </p>
          )}
      </div>
    </div>
  );
}

export default Planner;