import { TextField, Button, Grid, Container, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState, useEffect } from 'react';

const TaskInterface = () => {
  //Declare state variables to keep track of tasks
  const [currentTaskInput, setCurrentTaskInput] = useState('');
  const [taskLabels, setTaskLabels] = useState([]);
  const [taskComplete, setTaskComplete] = useState([]);
  const [taskId, setTaskId] = useState([]);

  useEffect( () => {
    getTasks();
  });

  const getTasks = () => {
    fetch('http://localhost:3001/tasks')
      .then(response => {
        return response.json();
      })
      .then(data => {
        if(data.length !== 0) {
          setTaskId(data.map( (x) => x.id));
          setTaskLabels(data.map((x) => x.task));
          setTaskComplete(data.map( (x) => x.complete ));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const  createTask = (task, user_id) => {
    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: task,
        complete: 0,
        user_id: user_id
      }),
    })
    .then(response => {
      return response.text();
    });
  }

  const updateTask = (id, complete) => {
    fetch('http://localhost:3001/tasks/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        complete: complete,
      }),
    })
    .then(response => {
      return response.text();
    });
  }

  const handleAddTaskOnClick = (e) => {
    setTaskLabels(oldTaskLabels => [...oldTaskLabels, currentTaskInput]);
    createTask(currentTaskInput,'0');
  }

  const handleCheckClick = (e) => {
    console.log(e.target.id);
    updateTask(e.target.id, e.target.checked);
  }

  return(
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField id="task-entry" label="Task" onChange={(e) => setCurrentTaskInput(e.target.value)}/>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleAddTaskOnClick}>
            Add
          </Button>
        </Grid>
        <Grid item xs={12}>
          { taskLabels.length === 0 ? <div></div> :
            <FormGroup>
              { taskLabels.map( (label,i) =>
                <FormControlLabel key={taskId[i]} control={<Checkbox id = {taskId[i].toString()} onChange = {handleCheckClick} />} label= {label}/>
              )}
            </FormGroup>
          }
        </Grid>
      </Grid>
    </Container>
  )
}

export default TaskInterface;
