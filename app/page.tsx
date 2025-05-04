"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import './page.css';

type User = {
  id: number;
  name: string;
  email: string;
};

type Post = {
  id: number;
  userId: number;
  content: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);  // You can adjust the number of posts per page
  const [totalPosts, setTotalPosts] = useState<number>(0); // For total number of posts from the API
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  // Fetch posts (using mock data for now)
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${postsPerPage}`
        );
        setPosts(response.data);
        
        // Fetch total posts for pagination control
        const totalResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setTotalPosts(totalResponse.data.length);
        
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  // Handle adding a post
  const handleAddPost = () => {
    if (newPost.trim()) {
      const newPostObj = {
        id: posts.length + 1,
        userId: users[0]?.id || 1,  // Here, assign userId dynamically, using first user as default
        content: newPost.trim(),
      };
      setPosts([...posts, newPostObj]);
      setNewPost("");  // Clear input field
    }
  };

  // Handle removing a post
  const handleRemovePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(totalPosts / postsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-title">Social Media Analytics</div>
        <div className="navbar-author">By Sunami</div>
      </nav>

      {/* Dashboard */}
      <main className="dashboard-container">
        <h1 className="dashboard-title">Social Media Dashboard</h1>

        {/* Analytics */}
        <section className="section">
          <h2 className="section-title">Analytics</h2>
          <ul className="card-list">
            <li className="card">Total Users: <strong>{users.length}</strong></li>
            <li className="card">Total Posts: <strong>{posts.length}</strong></li>
          </ul>
        </section>

        {/* Add Post Section */}
        <section className="section">
          <h2 className="section-title">Add Post</h2>
          <input
            type="text"
            className="add-post-input"
            placeholder="Write a new post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button onClick={handleAddPost} className="add-post-btn">Add Post</button>
        </section>

        {/* Users */}
        <section className="section">
          <h2 className="section-title">Users</h2>
          <ul className="card-list">
            {users.map(user => (
              <li key={user.id} className="card">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Posts */}
        <section className="section">
          <h2 className="section-title">Posts</h2>

          {/* Loading and Error states */}
          {loading && <p>Loading posts...</p>}
          {error && <p>{error}</p>}

          <ul className="card-list">
            {posts.map(post => (
              <li key={post.id} className="card">
                <p><strong>User ID:</strong> {post.userId}</p>
                <p>{post.content}</p>
                <button onClick={() => handleRemovePost(post.id)} className="remove-post-btn">Delete</button>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * postsPerPage >= totalPosts}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
