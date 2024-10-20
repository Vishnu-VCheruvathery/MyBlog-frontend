import React, { useEffect, useState } from 'react'
import Blogs from './Blogs'
import { Box, Fab, Stack, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast';
const Home = () => {
   const [blogs, setBlogs] =  useState([])
   let userID = null
   let username = null
   const token = useSelector((state) => state.user.token)
   
   if(token){
     userID = jwtDecode(token).id
     username = jwtDecode(token).username
   }
  

   const getPost = async() => {
      try{
         const response = await axios.get('https://myblog-server-01di.onrender.com/api/blogs/');
         if(response.data > 0){
            console.log('No Blogs!')
         }
         
         return response.data
      }catch(err){
         console.error(err)
      }
     
   }
 
   const deleteBlog = async ({id, token, blog}) => {
      try {
        if(username === blog.Author?.username){
          const response = await axios.delete(`https://myblog-server-01di.onrender.com/api/delete/${id}`)
          toast.success('Blog Deleted');
          const data = await getPost();
          setBlogs(data);
          return response.data
        }else{
          toast("You are not the author")
        }
        
      } catch (error) {
        console.error(error)
      }
        
     }

   


 // Use useEffect to fetch data on component mount
 useEffect(() => {
   const fetchData = async () => {
     const data = await getPost();  // await the result of getPost
     setBlogs(data);  // set blogs with the fetched data
   };
   fetchData();  // call the async function to fetch blogs
 }, []);  // empty dependency array ensures this runs once on mount 

  return (
  <>
 
         <div className='home'>
       
         {blogs.length > 0 ? (
            <Stack flex={2}>
            {blogs.map((blog) => (
            <Blogs key={blog._id} blog={blog} onDelete={deleteBlog}/>
          ))}
          <Link to='/new'>
          <Fab 
           sx={{
            backgroundColor: '#2374f7',
            color: 'white',
            position: 'fixed',
            right: {xs: '45%',lg: '50px'},
            bottom: '30px',
            ":hover":{
               color: 'black'
            }
           }}
           aria-label="add">
           <Add />
          </Fab></Link>
          </Stack>
         ) : (
            <Box sx={{width: {xs: '45%', md: '30%'},
        height: '250px', 
        backgroundColor: 'white', 
        border: '1px solid gray',
        margin: '100px auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '0.5em',
        opacity: '0.7'
        }}>
           <Typography variant='h6'>
           No Blogs, Add Some!!
           </Typography> 
          </Box>
         )}
          
          </div>
       
  </>
   
  )
}

export default Home
