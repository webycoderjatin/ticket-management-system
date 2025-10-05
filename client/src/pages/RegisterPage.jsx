import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Bounce, ToastContainer , toast } from 'react-toastify';

const RegisterPage = () => {
    const [name , setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cPassword, setcPassword] = useState("")
    const [errors , setErrors] = useState({})
    

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrors({})
        if(!name || !email || !password){
            alert("Please fill all the fields")
            return
        }
        if(password !== cPassword){
            setErrors({password : "Passwords do not match"})
            return
        }
        try{
            await axios.post(`/api/auth/register`,{
                name,
                email,
                password
            })
            toast.success("Registered Successfully")
            setName("")
            setEmail("")
            setPassword("")
            setcPassword("")
        }catch (err) {
            toast.error(err.response.data.msg)
            // 3. This 'catch' block will now work correctly
            if (err.response && err.response.data.error) {
                const errorData = err.response.data.error;
                const fieldName = errorData.field || 'general';
                const errorMessage = errorData.message;
                
                setErrors({ [fieldName]: errorMessage });
            } else {
                console.error("An unknown error occurred:", err);
                setErrors({ general: "An unexpected error occurred. Please try again." });
            }
        }
    }

  return (
    <div className='m-5 mt-20'>
      <h1 className='text-3xl text-center font-bold'>Register</h1>
      <form onSubmit={handleSubmit} className='w-1/3 mx-auto m-7 flex flex-col gap-5'>
      {errors.general && <p className='text-red-500 text-sm text-center'>{errors.general}</p>}
        <div className='flex flex-col justify-center items-start'>
        <label htmlFor="" required className='font-medium'>Name</label>
        <input type="text" className='text-xl p-2 rounded-lg w-full outline-none border border-2 border-gray-200' onChange={(e)=>setName(e.target.value)} value={name}/>
        </div>
        <div className='flex flex-col justify-center items-start'>
        <label htmlFor="" className='font-medium'>Email</label>
        <input type="email" required className='text-xl p-2 rounded-lg w-full outline-none border border-2 border-gray-200' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
        </div>

        <div className='flex flex-col justify-center items-start'>
        <label htmlFor="" className='font-medium'>Password</label>
        <input type="password" required className='text-xl p-2 rounded-lg w-full outline-none border border-2 border-gray-200' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        </div>

        <div className='flex flex-col justify-center items-start'>
        <label htmlFor="" className='font-medium'>Confirm Password</label>
        <input type="password" required className='text-xl p-2 rounded-lg w-full outline-none border border-2 border-gray-200' onChange={(e)=>setcPassword(e.target.value)} value={cPassword}/>
        {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
        </div>
        <button className='bg-orange-500 text-white font-bold text-lg w-1/2 py-2 rounded-lg mx-auto cursor-pointer' type='submit' value="login">Submit</button>
                <p className='text-center'>Already have an account? <Link to="/login" className='text-orange-500 font-bold'>Log in</Link></p>

      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default RegisterPage;
