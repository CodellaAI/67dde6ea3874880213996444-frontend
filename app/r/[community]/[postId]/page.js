
import PostDetail from '@/components/PostDetail'
import CommentSection from '@/components/CommentSection'
import Sidebar from '@/components/Sidebar'
import BackButton from '@/components/BackButton'

export default function PostPage({ params }) {
  const { community, postId } = params;
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <PostDetail postId={postId} community={community} />
          <CommentSection postId={postId} />
        </div>
        <div className="w-full md:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
