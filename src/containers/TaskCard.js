import { Card, CardHeader, CardContent, Grid, TextField, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UserInformation from '../components/UserInformation';
import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import QueryResult from '../components/query-results';

/** TASK gql query to retreive tasks for a user */
const TASK = gql`
    query getTasks($tasksForUserId: ID!) {
        tasksForUser(id: $tasksForUserId) {
        task_id
        description
        complete
        }
    } 
`;

//Mutation to add a task
const ADD_TASK = gql`
    mutation AddTaskToUser($addTaskToUserId: ID!, $description: String!, $complete: Boolean!) {
        addTaskToUser(id: $addTaskToUserId, description: $description, complete: $complete) {
        code
        success
        message
            task {
                task_id
                description
                complete
            }
        }
    }
`;

//Mutation to update completion status of a task
const UPDATE_COMPLETE = gql`
    mutation Mutation($updateCompleteId: ID!, $complete: Boolean!) {
        updateComplete(id: $updateCompleteId, complete: $complete) {
        code
        success
        message
        task {
            task_id
            description
            complete
        }
        }
    }
  `;

const TaskCard = (props) => {
    const [currentTaskInput, setCurrentTaskInput] = useState('');
    
    //Query for all tasks for the current user
    //refetch will allow for data refresh
    const { loading, error, data, refetch } = useQuery(TASK, {
        variables: { 
            tasksForUserId: props.user_id 
        }
    });

    //Mutation to add a new task to the user
    const [addTask] = useMutation(ADD_TASK, {
        variables: { addTaskToUserId: props.user_id, description: currentTaskInput, complete: false },
        // to observe what the mutation response returns
        onCompleted: (data) => {
            //refresh the list of tasks
            refetch({ tasksForUserId: props.user_id });
        },
    });
    
    //Mutaton to handle checking/unchecking a task
    const [updateComplete] = useMutation(UPDATE_COMPLETE, {
        onCompleted: (data) => {
            //refresh the list of tasks
            refetch({ tasksForUserId: props.user_id });
        }
    });

    return(
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader title={<UserInformation user_id = { props.user_id }/>} subheader = 'To do'/>
            <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField id="task-entry" label="Task" onChange={(e) => setCurrentTaskInput(e.target.value)}/>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={ addTask }>
                        Add
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <QueryResult error={ error } loading = { loading } data = { data } >
                    <FormGroup>
                        {
                           data?.tasksForUser?.map( (task) => {
                            return(<FormControlLabel key={task.task_id} 
                                control={<Checkbox id = {task.task_id.toString()} 
                                onChange = { (e) => {
                                        updateComplete( { variables: { updateCompleteId: task.task_id, complete: e.target.checked }, }) 
                                    }
                                }
                                checked={task.complete}
                                inputProps={{ 'aria-label': 'controlled' }} />} 
                                label= { task.description }
                            />);
                           }) 
                        }
                    </FormGroup>
                </QueryResult>
            </Grid>
            </CardContent>
        </Card>
    );
}

export default TaskCard;