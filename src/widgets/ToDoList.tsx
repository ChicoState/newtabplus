import React, { useState, useEffect } from "react";

import globalStyles from "../App.css";
import styles from "./ToDoList.css";
import { XIcon } from "@phosphor-icons/react";

interface Task {
  text: string;
  completed: boolean;
}

export function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { text: input.trim(), completed: false }]);
    setInput(""); // Clear input
  };

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className={[globalStyles.container, styles.body].join(" ")}>
      {/* Title at the top */}
      <h3 className={styles.title}>My To-Do List</h3>

      <ul className={styles["todo-list"]}>
        {tasks.map((task, i) => (
          <li
            key={i}
            className={task.completed ? styles.completed : ""}
            onClick={() => toggleTask(i)}
          >
            <span>{task.text}</span>
            <button
              className={styles["delete-task"]}
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(i);
              }}
            >
              <XIcon weight="bold"></XIcon>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles["todo-input-container"]}>
        <input
          className={globalStyles.container}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>
    </div>
  );
}
