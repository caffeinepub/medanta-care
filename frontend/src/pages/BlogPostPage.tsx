import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { useGetBlogPost } from '../hooks/useQueries';
import { formatDate } from '../lib/categoryUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { SiFacebook, SiWhatsapp } from 'react-icons/si';

export default function BlogPostPage() {
  const { id } = useParams({ from: '/blog/$id' });
  const { data: post, isLoading } = useGetBlogPost(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 rounded-2xl w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    );
  }

  if (!post || !post.status) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Post Not Found</h2>
        <p className="text-gray-500 mb-6">This blog post doesn't exist or hasn't been published yet.</p>
        <Link to="/blog" className="text-medanta-orange hover:underline font-semibold">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const coverImage = post.coverImageUrl || '/assets/generated/blog-cover-1.dim_800x400.png';
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(post.title);

  return (
    <div className="min-h-screen bg-medanta-grey">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link to="/blog" className="flex items-center gap-2 text-gray-500 hover:text-medanta-orange text-sm mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <article className="bg-white rounded-3xl shadow-card overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-64 sm:h-80 overflow-hidden bg-medanta-grey">
            <img
              src={coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = '/assets/generated/blog-cover-1.dim_800x400.png'; }}
            />
            <div className="absolute top-4 left-4">
              <span className="bg-medanta-orange text-white text-xs font-semibold px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-medanta-navy mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-medanta-orange" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-medanta-orange" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag size={14} className="text-medanta-orange" />
                <span>{post.category}</span>
              </div>
            </div>

            {/* Body */}
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-3">Share this article:</p>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-all"
                >
                  <SiFacebook size={14} />
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-all"
                >
                  <SiWhatsapp size={14} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
