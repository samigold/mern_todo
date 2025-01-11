import { Navbar, Nav, Container, NavDropdown, Badge} from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
    
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <Navbar.Brand href='/'>ToDo App</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            { userInfo ? (
                                <>
                                    <NavDropdown title={userInfo.name} id='username'>
                                        <Link to='/profile'>                            
                                        <NavDropdown.Item as={Link} to='/profile'>
                                                Profile
                                            </NavDropdown.Item>
                                        </Link>
                                            <NavDropdown.Item onClick={ logoutHandler }>
                                                Logout
                                            </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                
                                <Nav.Link as={Link} to='/login'>
                                    <FaSignInAlt  /> Sign In
                                </Nav.Link>
                                
                                
                                <Nav.Link as={Link} to='/register'>
                                    <FaSignInAlt /> Sign Up
                                </Nav.Link>
                                
                                </>
                            ) }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;