import { useSelector } from "react-redux";
import Hero from "../components/Hero";
import Todos from "./Todos";

const HomeScreen = () => {

    const { userInfo } = useSelector((state) => state.auth);

    return (
        <>
            {userInfo ? 
            (
                <>
                <Hero />
                <Todos />
                </>
            ):(
                <Hero />
            )}
        </>
    );

};

export default HomeScreen;