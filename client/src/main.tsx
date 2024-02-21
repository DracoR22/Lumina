import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import Feed from './pages/feed.tsx'
import Upload from './pages/upload.tsx'
import Profile from './pages/profile.tsx'
import Post from './pages/post.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Feed/>
  },
  {
    path: '/upload',
    element: <Upload/>
  },
  {
    path: '/profile/:id',
    element: <Profile/>
  },
  {
    path: '/post/:id',
    element: <Post/>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <RouterProvider router={router}/>
       <App />
  </React.StrictMode>,
)
