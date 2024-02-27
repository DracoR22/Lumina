import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import Feed from './pages/feed.tsx'
import Upload from './pages/upload.tsx'
import Profile from './pages/profile.tsx'
import Post from './pages/post.tsx'
import ProtectedRoute from './components/protected-route.tsx'
import { ApolloProvider } from '@apollo/client'
import { client } from './utils/apollo-client.ts'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
         <Feed/>
      </ProtectedRoute>
    )
  },
  {
    path: '/upload',
    element: (
      <ProtectedRoute>
         <Upload/>
      </ProtectedRoute>
    )
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
    <ApolloProvider client={client}>
     <RouterProvider router={router}/>
       <App />
    </ApolloProvider>
  </React.StrictMode>,
)
