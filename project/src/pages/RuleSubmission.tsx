import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface RuleSubmission {
  id: string;
  title: string;
  description: string;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  votes_for: number;
  votes_against: number;
  created_at: string;
}

export default function RuleSubmission() {
  const [submissions, setSubmissions] = useState<RuleSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('rule_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !submittedBy.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('rule_submissions')
        .insert([
          {
            title: title.trim(),
            description: description.trim(),
            submitted_by: submittedBy.trim(),
          },
        ]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      setSubmittedBy('');
      fetchSubmissions();
    } catch (error) {
      console.error('Error submitting rule:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id: string, voteType: 'for' | 'against') => {
    const submission = submissions.find((s) => s.id === id);
    if (!submission) return;

    try {
      const updates =
        voteType === 'for'
          ? { votes_for: submission.votes_for + 1 }
          : { votes_against: submission.votes_against + 1 };

      const { error } = await supabase
        .from('rule_submissions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      fetchSubmissions();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return baseClasses;
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-slate-300">This application needs to be configured with Supabase credentials to work properly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold text-white mb-8">Rule Submissions</h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Submit a New Rule</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="submittedBy" className="block text-sm font-medium text-white/90 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="submittedBy"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-2">
                Rule Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a short title for the rule"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe the rule in detail"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Rule'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">All Submissions</h2>
          {loading ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center text-white">
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center text-white">
              No rule submissions yet. Be the first to submit one!
            </div>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{submission.title}</h3>
                      <span className={getStatusBadge(submission.status)}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-white/80 mb-3">{submission.description}</p>
                    <p className="text-sm text-white/60">
                      Submitted by {submission.submitted_by} on{' '}
                      {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4">{getStatusIcon(submission.status)}</div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                  <button
                    onClick={() => handleVote(submission.id, 'for')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="font-semibold">{submission.votes_for}</span>
                  </button>
                  <button
                    onClick={() => handleVote(submission.id, 'against')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="font-semibold">{submission.votes_against}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
