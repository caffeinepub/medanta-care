import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useGetAllBlogPosts, useDeleteBlogPost, usePublishBlogPost, useUnpublishBlogPost } from '../../hooks/useQueries';
import { type BlogPost } from '../../backend';
import { formatDate } from '../../lib/categoryUtils';
import BlogFormModal from './BlogFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogManagementSection() {
  const { data: posts, isLoading } = useGetAllBlogPosts();
  const deletePost = useDeleteBlogPost();
  const publishPost = usePublishBlogPost();
  const unpublishPost = useUnpublishBlogPost();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
  const [actionId, setActionId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    setActionId(id);
    try { await deletePost.mutateAsync(id); } finally { setActionId(null); }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    setActionId(post.id);
    try {
      if (post.status) await unpublishPost.mutateAsync(post.id);
      else await publishPost.mutateAsync(post.id);
    } finally { setActionId(null); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-medanta-navy text-lg">Blog Management</h2>
          <p className="text-gray-500 text-sm">{(posts ?? []).length} posts</p>
        </div>
        <Button
          onClick={() => { setEditingPost(undefined); setModalOpen(true); }}
          className="bg-medanta-orange hover:bg-orange-600 text-white rounded-xl flex items-center gap-2 text-sm"
        >
          <Plus size={14} />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No blog posts yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-medanta-grey">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Author</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-medanta-grey/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-medanta-navy truncate max-w-[200px]">{post.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-medanta-orange/10 text-medanta-orange px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.author}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {post.status ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        disabled={actionId === post.id}
                        className={`p-1.5 rounded-lg transition-colors ${post.status ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'} disabled:opacity-50`}
                        title={post.status ? 'Unpublish' : 'Publish'}
                      >
                        {actionId === post.id ? <Loader2 size={14} className="animate-spin" /> : post.status ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => { setEditingPost(post); setModalOpen(true); }}
                        className="p-1.5 text-medanta-purple hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={actionId === post.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BlogFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPost={editingPost}
      />
    </div>
  );
}
