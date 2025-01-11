import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 

    const [login, { isLoading, error }] = useLoginMutation(); //this gets the login mutation from the usersApiSlice

    const { userInfo } = useSelector((state) => state.auth); //this gets the userInfo from the authSlice. state.auth is the authSlice in the store that has the userInfo
    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
        }, [navigate, userInfo]);
     //this is a useEffect hook that runs when the component mounts. It checks if the userInfo is not null (if user is logged in) and if it is not null, it navigates to the home page

    const submitHandler = async (e)=>{
        e.preventDefault();

        try {
            const res = await login({email, password}).unwrap();
            dispatch(setCredentials({...res}));
            navigate('/');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return ( 
        <FormContainer>
            <h1>Sign In</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                { isLoading && <Loader />}

                <Button type='submit' variant='primary' className='mt-3'>
                    Sign In
                </Button>
                </Form>

                <Row className='py-3'>
                    <Col>
                    New Customer <Link to='/register' className='text-primary' >Register</Link>
                    </Col>
                </Row>
        </FormContainer>

    )
};

export default LoginScreen;