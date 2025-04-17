const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  priority: String,
  status: String,
  progress: String,
});

const Task = mongoose.model("Task", taskSchema);
