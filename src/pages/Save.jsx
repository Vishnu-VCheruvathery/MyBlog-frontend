import { Box, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import SavedBlog from './savedBlog';
import toast from 'react-hot-toast';

const Save = () => {
  const [savedBlogs, setSaved] = useState([]);
  const token = useSelector((state) => state.user.token);
  let userID = null
  if(token){
    userID = jwtDecode(token).id
  }

  

  const getSavedBlogs = async ({ userID, token }) => {
    try {
      const response = await axios.get(`https://myblog-server-01di.onrender.com/api/savedBlogs/${userID}`);
     
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBlog = async ({userID, token, blogID}) => {
    try {
        const response = await axios.delete(`https://myblog-server-01di.onrender.com/api/savedBlogs/remove/${userID}/${blogID}`)
        toast.success('Blog removed from saved!');
        const data = await getSavedBlogs({ userID, token }); 
        setSaved(data);  
        return response.data   
    } catch (error) {
      console.error(error)
    }
      
   }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSavedBlogs({ userID, token });  
      setSaved(data);  // set blogs with the fetched data
    };
    fetchData();  // call the async function to fetch blogs
     
  }, []); // Update the dependencies

  return (
    <div className="home">
    {
      savedBlogs.length > 0
       ? (
        <Stack flex={2}>
          {savedBlogs.map((blog) => (
            <SavedBlog key={blog._id} blog={blog} onDelete={deleteBlog}/>
          ))}
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
           You have no Saved Blogs!!
           </Typography> 
          </Box>
      )
    }
    </div>
  );
};

export default Save
