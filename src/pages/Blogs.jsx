import { Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Bookmark, Delete,  Edit, } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';





const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Blogs = ({blog, onDelete}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  let userID = null
  let username = null
  const token = useSelector((state) => state.user.token)
  
  if(token){
    userID = jwtDecode(token).id
    username = jwtDecode(token).username
  }



   const saveBlog = async ({ blogID, token, userID }) => {
    try {
      const response = await axios.put(
        `https://myblog-server-01di.onrender.com/api/savedBlogs/${blogID}/${userID}`,
        {}
      );
      toast.success('Blog Saved');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  return (
    <>
   
      <Card sx={{
      width: {xs: '400px', lg: '650px'},
      margin: '20px auto',

    }}>
      <CardHeader
        title={blog.title}
        subheader={`Author: ${blog.Author.username}`}
      />
      <CardMedia
  component="img"
  height="20%"
  src={blog.image.url || '/no-image.jpg'}
  onError={(e) => {
    console.error("Image failed to load:", e.target.src);
  }}
/>
      <CardActions disableSpacing>
       {token ? (
        <IconButton 
        onClick={() => {
          onDelete({id: blog._id, token, blog: blog})
          }}
        aria-label="add to favorites">
          <Delete />
        </IconButton>
       ) : (
         <IconButton
          onClick={() => {toast("You need to be logged in to delete!")}}
         >
          <Delete />
         </IconButton>
       )}
       
       
        {token && username === blog.Author?.username ? (
          <Link   
          to={{
            pathname: `/edit/${blog._id}`,
            search: `?obj=${encodeURIComponent(JSON.stringify(blog))}`, // Add query parameters here
          }}
          >
        <IconButton aria-label="share">
        <Edit />
        </IconButton>
        </Link>
        ) : (
           <IconButton
           onClick={() => {toast("You need to be logged in to edit!")}}
           >
            <Edit />
           </IconButton>
        )}
        
        {token ? (
        
        <IconButton 
        aria-label="share"
        onClick={() => {
          saveBlog({blogID: blog._id, token: token, userID: userID})
        }}
        >
        <Bookmark />
        </IconButton>
       
        ) : (
           <IconButton
           onClick={() => {toast("You need to be logged in to edit!")}}
           >
            <Bookmark />
           </IconButton>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <p dangerouslySetInnerHTML={{__html: blog.content}}/>
        </CardContent>
      </Collapse>
    </Card>
      
    </>
    
  )
}

export default Blogs
