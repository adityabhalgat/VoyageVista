import { useState } from "react";
import axios from "axios";
import { useSignIn } from 'react-auth-kit'
import { Link, useNavigate } from "react-router-dom";
import { TourState } from "../../context/TourProvider";
import Toast from "../Utils/Toast";


function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setLoadUser } = TourState();
  const signIn = useSignIn();
  const navigate = useNavigate();


  const submitHandler = async () => {
    if (!email || !password) {
      alert("Some fields are missing")
      return;
    }


    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );
      if (signIn({
        token: data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: data.data.user,
      })) {
        Toast({ type: "success", message: "Logged in Successfully", duration: 1000 });
        setLoadUser(true);
        navigate("/")
      }
    } catch (error) {
      Toast({ type: "error", message: "User is not existed or credentials is wrong.", duration: 1000 });
    }
  };
  return (

    <>
      <div className="container mx-auto bg-white border-4 rounded-xl my-24 p-8 w-full md:w-1/2 xl:w-1/4 flex flex-col items-center justify-center">
        <h1 className="font-bold text-3xl mb-8">Login</h1>
        <form className="form font-bold w-full">
          <div className="relative">
            <label className="bg-none px-1 text-xs">Email</label>
            <input className="border border-gray-300 rounded px-3 py-2 w-full" type="email" name="email" onChange={(e) => setEmail(e.target.value)} placeholder='abc@gmail.com' />
          </div>
          <div className="relative my-2">
            <label className="bg-none px-1 text-xs">Password</label>
            <input className="border border-gray-300 rounded px-3 py-2 w-full" type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="p-4 mt-4 text-center w-full bg-pink-500 rounded-xl hover:bg-pink-700 transition-all text-white" onClick={submitHandler} type="button">Login</button>
        </form>
        <span className="text-base mt-2">
          First time on our website?
          <Link to={'/signup'}>
            <button className="ml-2 text-pink-600">Sign up</button>
          </Link>
        </span>
      </div>


    </>

  )
}

export default Login