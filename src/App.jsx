import {useEffect, useState} from 'react'
import {supabase} from './lib/supabase'

export default function App(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    async function fetchPosts(){
      const {data, error} = await supabase.from('posts').select('*');
      if(error) console.error(error);
      else setPosts(data)
      setLoading(false)
    }

    fetchPosts()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.id}</h2>
          <p>{post.content}</p>
        </div>
        ))}
    </div>
  )}

