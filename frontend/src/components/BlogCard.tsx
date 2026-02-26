import React from 'react';
import { Link } from '@tanstack/react-router';
import { Calendar, User } from 'lucide-react';
import { type BlogPost } from '../backend';
import { formatDate } from '../lib/categoryUtils';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const coverImage = post.coverImageUrl || '/assets/generated/blog-cover-1.dim_800x400.png';
  const excerpt = post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <Link to="/blog/$id" params={{ id: post.id }}>
        <div className="relative h-48 overflow-hidden bg-medanta-grey">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = '/assets/generated/blog-cover-1.dim_800x400.png'; }}
          />
          <div className="absolute top-3 left-3">
            <span className="bg-medanta-orange text-white text-xs font-semibold px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <Link to="/blog/$id" params={{ id: post.id }}>
          <h3 className="font-display font-bold text-medanta-navy text-base leading-snug mb-2 hover:text-medanta-orange transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-3 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
