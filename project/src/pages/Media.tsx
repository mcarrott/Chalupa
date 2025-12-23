import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MediaFolder } from '../types/database';
import { Image, FolderOpen, ExternalLink, Calendar, AlertCircle } from 'lucide-react';

export default function Media() {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    try {
      const { data, error } = await supabase
        .from('media_folders')
        .select('*')
        .order('season_year', { ascending: false });

      if (error) throw error;
      if (data) setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-slate-300">This application needs to be configured with Supabase credentials to work properly.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image className="h-10 w-10 text-amber-500" />
            <h1 className="text-5xl font-bold text-white">Media Gallery</h1>
          </div>
          <p className="text-xl text-slate-300">Photos, videos, and memories from the league</p>
        </div>

        {folders.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700">
            <FolderOpen className="h-20 w-20 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No media folders yet. Start capturing the moments!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <a
                key={folder.id}
                href={folder.folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 hover:scale-105"
              >
                <div className="relative h-56 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                  {folder.thumbnail_url ? (
                    <img
                      src={folder.thumbnail_url}
                      alt={folder.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="h-20 w-20 text-slate-600 group-hover:text-amber-500 transition-colors duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-slate-900/80 p-2 rounded-full">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                  {folder.season_year && (
                    <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                      {folder.season_year}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
                    {folder.title}
                  </h3>
                  {folder.description && (
                    <p className="text-slate-300 text-sm mb-3">{folder.description}</p>
                  )}
                  <div className="flex items-center text-slate-500 text-xs">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(folder.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 bg-slate-800/30 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-2">About the Media Gallery</h3>
          <p className="text-slate-300 text-sm">
            This section contains links to external folders (like Google Drive) where we store league photos,
            videos, and other memorable moments. Click on any folder to view its contents in a new tab.
          </p>
        </div>
      </div>
    </div>
  );
}
