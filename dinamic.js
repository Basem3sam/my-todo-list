let todoDataSet = []

$(document).ready(function() {
  console.log("DOM is ready!");
  
  $("button#add-task-btn").on("click", () => {
    const newTask = getData();
    if(newTask && newTask.Task) {
      todoDataSet.push(newTask);
      updateList();
    } else {
        console.log("Task input was cancelled or empty.");
    }
  });

  $("ul#task-list").on("click", "button.delete-task-btn", function() {
    // Get the data-id from the parent <li>
    const $listItem = $(this).closest(".task-item");
    const taskId = $listItem.data("id"); // Retrieve the data-id attribute
    if (taskId !== undefined && todoDataSet[taskId]) {
      todoDataSet.splice(taskId,1)
      updateList()
    }
  })

  $("ul#task-list").on("change", "input.task-checkbox", function() {
    const $listItem = $(this).closest(".task-item");
    const taskId = $listItem.data("id");

    if (taskId !== undefined && todoDataSet[taskId]) {
      // Toggle the 'Completed' status in the dataset
      todoDataSet[taskId].Completed = $(this).prop("checked");
      // Add/remove 'completed' class on the list item for styling
      $listItem.toggleClass("completed", todoDataSet[taskId].Completed);
      console.log(`Task '${todoDataSet[taskId].Task}' completion status changed to: ${todoDataSet[taskId].Completed}`);
    }
  });

    $("ul#task-list").on("dblclick", "label.task-label", function() {
    const $label = $(this);
    const $listItem = $label.closest(".task-item");
    const taskId = $listItem.data("id");

    if (taskId !== undefined && taskId >= 0 && taskId < todoDataSet.length) {
      const currentTaskText = todoDataSet[taskId].Task;

      // Replace label with an input field
      const $editInput = $("<input>")
        .attr({
          type: "text",
          class: "edit-task-input", // Apply a class for styling if needed
          value: currentTaskText
        })
        .css({ // Basic inline styling for input to look good quickly
          'flex-grow': '1',
          'padding': '5px',
          'border': '1px solid #ccc',
          'border-radius': '4px',
          'font-size': '1.1em'
        })
        .on("keypress", function(e) {
          if (e.which === 13) { // Check for Enter key
            $(this).blur(); // Trigger blur to save changes
          }
        })
        .on("blur", function() { // Save changes when input loses focus
          const newText = $(this).val().trim();
          if (newText && newText !== currentTaskText) { // Only update if text changed and not empty
            todoDataSet[taskId].Task = newText; // Update the data
            updateList(); // Re-render the list
          } else if (newText === "") {
            // Optional: Alert user if they tried to save an empty task
            alert("Task description cannot be empty. Reverting to original.");
            updateList(); // Revert by re-rendering
          } else {
            updateList(); // Revert to original text if no change or user cancelled
          }
        });

      $label.replaceWith($editInput); // Swap the label with the input
      $editInput.focus(); // Focus the input for immediate typing
    }
  });
});

function updateList() {
  const $taskList = $("ul#task-list");
  $taskList.empty(); // Clear existing list items before re-rendering

  if (todoDataSet.length === 0) {
    // Show empty message if there are no tasks
    $taskList.append('<p class="empty-list-message">Your to-do list is empty! Click \'+\' to add a new task.</p>');
    return;
  }

  // Hide the empty message if tasks exist (in case it was previously shown)
  $taskList.find('.empty-list-message').remove();

  todoDataSet.forEach((obj, index) => {
    // Create the list item element
    const $listItem = $("<li>").addClass("task-item");
    $listItem.attr("data-id", index); // Assign a data-id for easy reference (e.g., for deletion)

    // Create the checkbox
    const $checkbox = $("<input>")
      .attr({
        type: "checkbox",
        id: `task-${index}`, // Unique ID for each checkbox
        class: "task-checkbox",
      })
      .prop("checked", obj.Completed || false); // Set checked state based on obj.Completed

    // Create the label for the task text
    const $label = $("<label>")
      .attr("for", `task-${index}`) // Link label to checkbox by ID
      .addClass("task-label")
      .text(obj.Task); // Display the task text

    // Create the delete button
    const $deleteButton = $("<button>")
      .addClass("delete-task-btn")
      .attr({
        "aria-label": `Delete task: ${obj.Task}`, // Accessible label for screen readers
        "title": `Delete task: ${obj.Task}` // Tooltip on hover
      })
      .text("✖");

    // Append elements to the list item
    $listItem.append($checkbox, $label, $deleteButton);

    if (obj.Completed) {
      $listItem.addClass("completed");
    }

    // Append the complete list item to the task list
    $taskList.append($listItem);
  });
}

function getFormattedCurrentDate() {
  const currentDate = new Date();
  const formattedDate = dateFns.format(currentDate, "MMMM do, yyyy 'at' hh:mm a");
  return formattedDate;
}

function getData() {
  let task = prompt("الرجاء ادخال عنوان المهمه");

  // Handle cancelled prompt or empty/whitespace input
  // Returns null if input is invalid
  if (task === null || task.trim() === "") {
    alert("Task cannot be empty. Please enter a task.");
    return null;
  }
  return {Task: task.trim(), Date: getFormattedCurrentDate(), Completed: false}
}