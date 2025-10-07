// src/components/PostList.jsx
import React from 'react';
import { useEffect, useState } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/posts/')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">All Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-600 dark:text-github-darkText">By {post.author}</p>
          <p dangerouslySetInnerHTML={{ __html: post.content }} className="mt-2" />
        </div>
      ))}
    </div>
  );
}

export default PostList;