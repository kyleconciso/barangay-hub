import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function ArticleList({ articles }) {
  return (
    <List>
      {articles.map((article) => (
        <React.Fragment key={article.id}>
          <ListItem alignItems="flex-start" component={RouterLink} to={`/news/${article.slug}`} sx={{ textDecoration: 'none' }}>
            <ListItemText
              primary={article.title}
              secondary={
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                  </Typography>
                  {/* Display createdAt */}
                  {article.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                        {/* formatDate from utils.js */}
                      {new Date(article.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

export default ArticleList;