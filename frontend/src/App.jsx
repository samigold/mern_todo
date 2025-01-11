import Header from "./components/Header";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";//this is the toastify css file

const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <Container className="my-2">
      <Outlet />
      </Container>
    </>
  );
};

export default App;