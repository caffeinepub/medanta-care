import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { type BlogPost, ExternalBlob } from '../../backend';
import { useCreateBlogPost, useUpdateBlogPost, usePublishBlogPost } from '../../hooks/useQueries';
import { Loader2, Upload } from 'lucide-react';

interface BlogFormModalProps {
  open: boolean;
  onClose: () => void;
  initialPost?: BlogPost;
}

export default function BlogFormModal({ open, onClose, initialPost }: BlogFormModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [publishOnSave, setPublishOnSave] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const publishPost = usePublishBlogPost();

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setContent(initialPost.content);
      setCategory(initialPost.category);
      setAuthor(initialPost.author);
      setCoverImageUrl(initialPost.coverImageUrl);
      setCoverPreview(initialPost.coverImageUrl || null);
      setPublishOnSave(initialPost.status);
    } else {
      setTitle(''); setContent(''); setCategory(''); setAuthor('');
      setCoverImageUrl(''); setCoverPreview(null); setPublishOnSave(false);
    }
    setUploadProgress(0);
  }, [initialPost, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(pct => setUploadProgress(pct));
    setCoverImageUrl(blob.getDirectURL());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let postId: string;
    if (initialPost) {
      await updatePost.mutateAsync({ blogId: initialPost.id, title, content, category, author, coverImageUrl });
      postId = initialPost.id;
    } else {
      postId = await createPost.mutateAsync({ title, content, category, author, coverImageUrl });
    }
    if (publishOnSave && (!initialPost || !initialPost.status)) {
      await publishPost.mutateAsync(postId);
    }
    onClose();
  };

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-medanta-navy">
            {initialPost ? 'Edit Blog Post' : 'New Blog Post'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category *</Label>
              <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Health Tips" required className="mt-1" />
            </div>
            <div>
              <Label>Author *</Label>
              <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Dr. Name" required className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Content *</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} required className="mt-1" rows={6} placeholder="Write your blog post content here..." />
          </div>
          <div>
            <Label>Cover Image</Label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-medanta-orange transition-colors">
              {coverPreview ? (
                <div>
                  <img src={coverPreview} alt="Cover preview" className="max-h-32 mx-auto rounded-lg object-cover mb-2" />
                  <label className="cursor-pointer text-xs text-medanta-orange hover:underline">
                    Change image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-medanta-orange h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload cover image</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="publish"
              checked={publishOnSave}
              onCheckedChange={v => setPublishOnSave(!!v)}
            />
            <label htmlFor="publish" className="text-sm font-medium cursor-pointer">
              Publish immediately
            </label>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full">
              {isPending ? <><Loader2 size={14} className="animate-spin mr-1" />Saving...</> : initialPost ? 'Update Post' : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
