
import PostFeed from '@/components/PostFeed'
import Sidebar from '@/components/Sidebar'
import TopCommunities from '@/components/TopCommunities'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="card p-4 mb-4">
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium whitespace-nowrap">
                Best
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium whitespace-nowrap hover:bg-gray-300">
                Hot
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium whitespace-nowrap hover:bg-gray-300">
                New
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium whitespace-nowrap hover:bg-gray-300">
                Top
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium whitespace-nowrap hover:bg-gray-300">
                Rising
              </button>
            </div>
          </div>
          <PostFeed />
        </div>
        <div className="w-full md:w-1/3 space-y-4">
          <TopCommunities />
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
