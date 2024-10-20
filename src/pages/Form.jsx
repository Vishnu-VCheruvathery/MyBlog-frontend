import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getToken } from '../features/userSlice'

const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [loggedUser, setLoggedUser] = useState('')
   const [loggedPassword, setLoggedPassword] = useState('')

   const Register = async() => {
    try {
     const response = await axios.post('https://myblog-server-01di.onrender.com/api/register/', 
      {username:username, 
        password:password}
      )
      setUsername('')
      setPassword('')
      if(response.data.error){
        toast.error(response.data.error)
      }else{
        toast.success('Successfully Registered!')
      }
     
     
    } catch (error) {
      toast.error(error)
      console.log(error)
    }  
   
    
   }


   const Login = async () => {
    try {
      const response = await axios.post('https://myblog-server-01di.onrender.com/api/login/', {
        username: loggedUser,
        password: loggedPassword,
      });
  
      setLoggedUser('')
      setLoggedPassword('')
      if (response.status === 200) {
        const token = await response.data.token;
        if (token) {
          // Token is valid, store it
          localStorage.setItem('authToken', token);
          dispatch(getToken())
          navigate("/")
          toast.success(`Welcome ${loggedUser}`);
        } else {
          // Handle invalid token
          toast.error(response.data.error);
        }
      } else {
        // Handle error response
        toast.error(response.data.error);
      }
      
      
    }catch(err){
 
      console.log(err)
    }
  };




  return (
    <Stack 
    direction={{xs:'column' ,lg: 'row', md: 'row'}} 
    spacing={{xs: 2, lg: 5}}
   sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: {xs: 5, lg: 15}
   }}
    >
      <Box sx={{
        backgroundColor: 'white',
        width: 300,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: 'column',
        borderRadius: '0.5em',
        gap: 3,
        boxShadow: ' 0 0 10px 5px rgba(0, 0, 0, 0.5)'
      }}>
        <Typography variant='h5' sx={{fontWeight: 100}}>Login</Typography>
          <TextField
          required
          id="outlined-required"
          label="Username"
          value={loggedUser}
          onChange={(e) => setLoggedUser(e.target.value)}
          autoComplete='off'
        />
           <TextField
          required
          id="outlined-required"
          label="Password"
          type='password'
          value={loggedPassword}
          onChange={(e) => setLoggedPassword(e.target.value)}
          autoComplete='off'
        />
          <Button variant="contained" sx={{
            backgroundColor:"#2374f7"
          }}
          onClick={Login}
          >
            LOGIN
          </Button>
      </Box>
      <Box sx={{
        backgroundColor: 'white',
        width: 300,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: 'column',
        borderRadius: '0.5em',
        gap: 3,
        boxShadow: ' 0 0 10px 5px rgba(0, 0, 0, 0.5)'
      }}>
        <Typography variant='h5' sx={{fontWeight: 100}}>Register</Typography>
          <TextField
          required
          id="outlined-required"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete='off'
        />
           <TextField
          required
          id="outlined-required"
          label="Password"
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='off'
        />
          <Button variant="contained" sx={{
            backgroundColor:"#2374f7"
          }}
          onClick={Register}
          >
            REGISTER
          </Button>
      </Box>
    </Stack>
  )
}

export default Form
