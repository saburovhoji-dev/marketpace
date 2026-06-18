'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';

interface User {
  userId: number;
  username: string;
  email: string;
}

interface Post {
  id: number;
  username: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  replies: number;
  category: string;
}

const DEFAULT_POSTS: Post[] = [
  {
    id: 1,
    username: 'dev_uz',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
    time: '2 hours ago',
    content: 'Just bought the Telegram Shop Bot! The integration was super easy and it supports payment systems directly. High recommended for local businesses in Uzbekistan.',
    likes: 24,
    replies: 5,
    category: 'Bots & Scripts'
  },
  {
    id: 2,
    username: 'alex_it',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150',
    time: '5 hours ago',
    content: 'Are there any sellers listing custom Figma designs soon? Need a clean futuristic dashboard dashboard template for an educational project.',
    likes: 12,
    replies: 2,
    category: 'Design & Graphics'
  },
  {
    id: 3,
    username: 'ai_guru',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150',
    time: '1 day ago',
    content: 'The new AI Face Generator Model was updated today! Performance is 30% faster now on consumer GPUs. Check it out on the market page.',
    likes: 45,
    replies: 9,
    category: 'AI & Machine Learning'
  }
];

export default function CommunityClient({ currentUser, locale }: { currentUser: User | null; locale: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const savedPosts = localStorage.getItem('marketplace_community_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(DEFAULT_POSTS);
      localStorage.setItem('marketplace_community_posts', JSON.stringify(DEFAULT_POSTS));
    }
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    if (!currentUser) {
      alert('You must be logged in to post a message.');
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      username: currentUser.username,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPbpQuTh59C0cCW8NTLHgsnzjIwfyC8o7GTFIdBdtSLuDF-0Yyiz4VvEn_BPYIKRheWPTICcuTMoR0-e_m-WnoOYm3i29YkGYXZisinlcTUh2HF3RwT6EkCpFr8InyYnNjo0-Gpru0T9Q666mnXUQGaeANetPwqDakYUfr5v7uHbTKS7qF-I7oWD6_Vk3A6_bB6Hs8dRVaRcHOUWEz0Ez34ppH6VxTiWIyiD-UsI7rgmPOxbfeta8aduLPnhIWJ814EubnVi-ZQCuw',
      time: 'Just now',
      content: newPostContent,
      likes: 0,
      replies: 0,
      category: selectedCategory === 'All' ? 'General' : selectedCategory
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('marketplace_community_posts', JSON.stringify(updatedPosts));
    setNewPostContent('');
  };

  const handleLike = (id: number) => {
    const updated = posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    });
    setPosts(updated);
    localStorage.setItem('marketplace_community_posts', JSON.stringify(updated));
  };

  const categories = ['All', 'General', 'Bots & Scripts', 'Design & Graphics', 'AI & Machine Learning', 'Accounts & Premium'];

  const filteredPosts = posts.filter(post => {
    if (filterCategory === 'All') return true;
    return post.category === filterCategory;
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-headline-lg bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
          Community Discussion Board
        </h2>
        <p className="text-on-surface-variant font-body-md">
          Connect with other developers, share reviews, ask questions and learn about updates.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full font-label-mono text-xs transition-all whitespace-nowrap border ${
              filterCategory === cat
                ? 'bg-primary/20 border-primary text-primary font-bold'
                : 'bg-white/5 border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Discussion Feed (Left) */}
        <div className="lg:col-span-8 space-y-6">
          {currentUser ? (
            <form onSubmit={handlePostSubmit} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPbpQuTh59C0cCW8NTLHgsnzjIwfyC8o7GTFIdBdtSLuDF-0Yyiz4VvEn_BPYIKRheWPTICcuTMoR0-e_m-WnoOYm3i29YkGYXZisinlcTUh2HF3RwT6EkCpFr8InyYnNjo0-Gpru0T9Q666mnXUQGaeANetPwqDakYUfr5v7uHbTKS7qF-I7oWD6_Vk3A6_bB6Hs8dRVaRcHOUWEz0Ez34ppH6VxTiWIyiD-UsI7rgmPOxbfeta8aduLPnhIWJ814EubnVi-ZQCuw" alt="" className="w-full h-full object-cover"/>
                </div>
                <span className="font-bold text-white text-sm">@{currentUser.username}</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="ml-auto bg-neutral-900 border border-white/10 rounded-lg text-xs font-label-mono py-1 px-3 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'General' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={3}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-body-md text-white placeholder:text-outline/70 resize-none text-sm"
                placeholder="Share your thoughts, ask a question or write a review..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold hover:shadow-[0_0_15px_rgba(194,193,255,0.4)] active:scale-95 transition-all text-xs"
                >
                  Post to Board
                </button>
              </div>
            </form>
          ) : (
            <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-4">
              <p className="text-on-surface-variant text-sm">You must be logged in to contribute to the discussion.</p>
              <Link
                href="/login"
                className="inline-block bg-primary text-on-primary px-6 py-2 rounded-xl font-bold text-xs"
              >
                Log In
              </Link>
            </div>
          )}

          {/* Feed */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <p className="text-on-surface-variant italic text-center py-10">No discussions in this category yet. Be the first to post!</p>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.username} className="w-9 h-9 rounded-full object-cover"/>
                    <div>
                      <h4 className="font-bold text-white text-sm">@{post.username}</h4>
                      <p className="text-on-surface-variant text-[10px] font-label-mono">{post.time}</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[9px] font-label-mono rounded">
                      {post.category}
                    </span>
                  </div>

                  <p className="text-white text-sm font-body-md leading-relaxed">{post.content}</p>

                  <div className="flex gap-4 pt-3 border-t border-white/5 text-[11px] font-label-mono text-on-surface-variant">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${post.hasLiked ? 'text-primary' : ''}`}
                    >
                      <span className="material-symbols-outlined text-[16px]" data-icon="thumb_up">
                        {post.hasLiked ? 'thumb_up' : 'thumb_up_off_alt'}
                      </span>
                      {post.likes} Likes
                    </button>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]" data-icon="chat_bubble">chat_bubble</span>
                      {post.replies} Replies
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Information (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-headline-lg text-white">Market Activity</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-xs text-white">@alex_it bought Figma UI Kit</p>
                  <span className="text-[10px] text-on-surface-variant font-label-mono">10 mins ago</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-xs text-white">New seller: @neo_dev registered</p>
                  <span className="text-[10px] text-on-surface-variant font-label-mono">1 hour ago</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-xs text-white">@dev_uz uploaded TG Shop Bot v2</p>
                  <span className="text-[10px] text-on-surface-variant font-label-mono">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
