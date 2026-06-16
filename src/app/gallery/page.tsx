'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [category]);

  async function fetchImages() {
    setLoading(true);
    try {
      const params = category ? `?category=${category}` : '';
      const res = await fetch(`/api/gallery${params}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const categories = ['', 'showroom', 'interior', 'exterior', 'launch_event', 'team'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">Gallery</h1>
          <p className="text-gray-500 text-center mb-8">Explore our showrooms and events</p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat ? cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No images found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img: any) => (
                <div key={img.id} className="group relative rounded-xl overflow-hidden bg-gray-100">
                  <div className="aspect-[4/3]">
                    <img src={img.imageUrl} alt={img.altText || img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <p className="text-white font-medium text-sm">{img.title}</p>
                      <p className="text-white/80 text-xs">{img.category?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
