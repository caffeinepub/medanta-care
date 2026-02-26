import React, { useState } from 'react';
import { useGetPublishedBlogPosts, useGetBlogPostsByCategory } from '../hooks/useQueries';
import BlogCard from '../components/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = ['All', 'Health Tips', 'Medicine Guide', 'Diabetes', 'Heart Health', 'Nutrition', 'Wellness'];

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: allPosts, isLoading: allLoading } = useGetPublishedBlogPosts();
  const { data: categoryPosts, isLoading: catLoading } = useGetBlogPostsByCategory(
    selectedCategory !== 'All' ? selectedCategory : ''
  );

  const posts = selectedCategory === 'All' ? (allPosts ?? []) : (categoryPosts ?? []);
  const isLoading = selectedCategory === 'All' ? allLoading : catLoading;

  return (
    <div className="min-h-screen bg-medanta-grey">
      {/* Header */}
      <div className="bg-medanta-navy py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display font-bold text-4xl text-white mb-3">Health & Wellness Blog</h1>
          <p className="text-white/70 text-lg">Expert advice, medicine guides, and health tips from MEDANTA CARE</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-medanta-orange text-white shadow-orange'
                  : 'bg-white text-gray-600 hover:border-medanta-orange border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="font-display font-bold text-xl text-medanta-navy mb-2">No Posts Found</h3>
            <p className="text-gray-500">
              {selectedCategory === 'All'
                ? 'No blog posts have been published yet.'
                : `No posts found in the "${selectedCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
