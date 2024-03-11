import { useEffect, useRef } from "react"
import { GET_ALL_POSTS } from "../graphql/queries/get-posts"
import MainLayout from "../layouts/main-layout"
import { useQuery } from "@apollo/client"

const Feed = () => {

  const loadMoreRef = useRef(null)

  const { data, loading, fetchMore } = useQuery(GET_ALL_POSTS, {
    variables: { skip: 0, take: 2 },
  })

  const loadMorePosts = async () => {
    try {
      await fetchMore({
        variables: {
          skip: data?.getPosts.length || 0,
          take: 2,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          const newPosts = fetchMoreResult.getPosts.filter(
            (newPost) => !prev.getPosts.some((post) => post.id === newPost.id)
          )
          return {
            getPosts: [...prev.getPosts, ...newPosts],
          }
        },
      })
      console.log(data)
    } catch (error) {
      console.error("Error fetching more posts:", error)
    }
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Observer triggered")
          loadMorePosts()
        }
      },
      { threshold: 1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMorePosts])

  return (
    <MainLayout>
       Feed
    </MainLayout>
  )
}

export default Feed