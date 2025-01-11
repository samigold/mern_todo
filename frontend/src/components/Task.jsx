import React, { useState } from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import FormContainer from './FormContainer';

const Task = () => {
  const [taskName, setTaskName] = useState('');

  return (
    <>
      <FormContainer>
        <Form>
        <button type="button">+</button>
        <input 
          type="text" 
          value={taskName} 
          onChange={(ev) => setTaskName(ev.target.value)} 
          placeholder="Your next task..." 
        />
        </Form>
        <div>
        <input type="checkbox" />
        <label>test task</label>
      </div>
      </FormContainer>
    </>
  );
};

export default Task;