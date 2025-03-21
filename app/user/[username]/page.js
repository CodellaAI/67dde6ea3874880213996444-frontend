
import UserProfile from '@/components/UserProfile'
import UserPosts from '@/components/UserPosts'
import UserComments from '@/components/UserComments'
import { Tabs } from '@/components/Tabs'

export default function UserPage({ params }) {
  const { username } = params;
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <UserProfile username={username} />
      
      <div className="mt-6">
        <Tabs 
          tabs={[
            { id: 'posts', label: 'Posts', content: <UserPosts username={username} /> },
            { id: 'comments', label: 'Comments', content: <UserComments username={username} /> },
          ]}
        />
      </div>
    </div>
  )
}
