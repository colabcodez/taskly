import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api";

const Update = ({ display, update }) => {
  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    if (update) {
      setInputs({
        title: update.title || "",
        body: update.body || "",
      });
    }
  }, [update]);

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async () => {
    if (!update || !update._id) {
      toast.error("No task selected for update");
      return;
    }

        try {
          const response = await axios.put(API_ENDPOINTS.TASKS.UPDATE(update._id), Inputs);
          toast.success(response.data.message);
          display("none");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="update">
      <h3>Update Your Task</h3>
      <input
        type="text"
        className="task-input"
        name="title"
        placeholder="Task title"
        value={Inputs.title}
        onChange={change}
      />
      <textarea
        className="task-textarea"
        name="body"
        placeholder="Task description"
        value={Inputs.body}
        onChange={change}
        rows="4"
      />
      <div className="update-actions">
        <button className="cancel-btn" onClick={() => display("none")}>
          Cancel
        </button>
        <button className="update-btn" onClick={submit}>
          Update Task
        </button>
      </div>
    </div>
  );
};

export default Update;