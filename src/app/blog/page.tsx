'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?published=true')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">Blog</h1>
          <p className="text-gray-500 text-center mb-12">Latest news and updates from Ather Energy</p>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No posts yet</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post: any) => (
                <article key={post.id} className="bg-white rounded-xl border overflow-hidden">
                  {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.createdAt).toLocaleDateString('en-IN')}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{post.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                    {post.excerpt && <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>}
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{post.content}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
