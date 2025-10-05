import React from 'react';
import { useState } from 'react';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(!email || !password){
            alert("Please fill all the fields")
            return
        }
        try{
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,{
                email,
                password
            })

            login(res.data.token);
            const decodedUser = jwtDecode(res.data.token);
            const userRole = decodedUser.user.role;
            
            if (userRole === 'Agent' || userRole === 'Admin') {
                navigate("/tickets"); // Agents and Admins go to the main ticket list
            } else {
                navigate("/tickets/new"); // Customers can go directly to create a ticket
            }
        }catch(err){
            console.error("Login Error : ", err)
        }
    }

  return (
    <div className='m-5 mt-20'>
      <h1 className='text-3xl text-center font-bold'>Sign In</h1>
      <form onSubmit={handleSubmit} className='w-1/3 mx-auto m-7 flex flex-col gap-5'>
        <div className='flex flex-col justify-center items-start'>
        <label htmlFor="" className='font-medium'>Email</label>
        <input type="email" required className='text-xl p-2 rounded-lg w-full outline-none border border-2 border-gray-200' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </div>

        <div className='flex flex-col justify-center items-start'>
        <label htmlFor="" className='font-medium'>Password</label>
        <input type="password" required className='text-xl p-2 rounded-lg w-full outline-none border border-2 border-gray-200' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        </div>
        <button className='bg-orange-500 text-white font-bold text-lg w-1/2 py-2 rounded-lg mx-auto cursor-pointer' type='submit' value="login">Submit</button>
        <p className='text-center'>Don't have an account? <Link to="/register" className='text-orange-500 font-bold'>Sign Up</Link></p>
      </form>
    </div>
  );
}

export default LoginPage;
