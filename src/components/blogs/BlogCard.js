import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
} from '@mui/material';

import { Link } from 'react-router-dom';

const BlogCard = ({ id, title, description, date, image, url, path }) => {
  return (
    <Card sx={{ maxWidth: 345, minHeight: 250, textAlign: 'left' }}>
      {/* <CardMedia sx={{ height: 140 }} image={image} title={title} /> */}
      <CardContent>
        <Typography
          sx={{ fontSize: '16px' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: '12px' }}
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          {description}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          {new Date(date).toLocaleDateString()}
        </Typography> */}
      </CardContent>
      <CardActions>
        <Box width="100%" display="flex" alignContent="space-around">
          <Button disabled>{new Date(date).toLocaleDateString()}</Button>
          <Button size="small" href={url} target="_blank">
            Link to post
          </Button>
          {path !== '' && (
            <Button size="small" href={`${path}`}>
              Demo
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
