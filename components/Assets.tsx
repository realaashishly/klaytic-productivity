import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, Film, FileArchive, Download, File, X, Eye, Trash2, Loader2 } from 'lucide-react';
import { Asset } from '../types';
import { useUploadThing } from '@/lib/uploadthing';
import { getAssets, createAsset, deleteAsset } from '@/actions/assetActions';

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("assetUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        const file = res[0];
        const newAsset = await createAsset({
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: getFileType(file.type || file.name),
          url: file.ufsUrl,
          key: file.key,
          uploadDate: new Date().toISOString().split('T')[0]
        });

        if (newAsset) {
          // @ts-ignore
          setAssets(prev => [newAsset, ...prev]);
        }
      }
    },
    onUploadError: (error: Error) => {
      alert(`ERROR! ${error.message}`);
    },
  });

  useEffect(() => {
    const fetchAssets = async () => {
      const fetchedAssets = await getAssets();
      // @ts-ignore
      setAssets(fetchedAssets);
      setLoading(false);
    };
    fetchAssets();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await startUpload(Array.from(e.target.files));
    }
  };

  const handleDeleteAsset = async (id: string, key: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const success = await deleteAsset(id, key);
      if (success) {
        setAssets(prev => prev.filter(a => a.id !== id));
        if (previewAsset?.id === id) {
          setPreviewAsset(null);
        }
      }
    }
  };

  const getFileType = (mime: string): Asset['type'] => {
    if (!mime) return 'other';
    const lowerMime = mime.toLowerCase();
    if (lowerMime.includes('image') || lowerMime.endsWith('.png') || lowerMime.endsWith('.jpg') || lowerMime.endsWith('.jpeg')) return 'image';
    if (lowerMime.includes('pdf') || lowerMime.endsWith('.pdf')) return 'pdf';
    if (lowerMime.includes('video') || lowerMime.endsWith('.mp4')) return 'video';
    if (lowerMime.includes('zip') || lowerMime.includes('rar') || lowerMime.endsWith('.zip')) return 'zip';
    if (lowerMime.includes('text') || lowerMime.endsWith('.txt')) return 'txt';
    return 'other';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" size={20} />;
      case 'image': return <ImageIcon className="text-purple-500" size={20} />;
      case 'video': return <Film className="text-cyan-500" size={20} />;
      case 'zip': return <FileArchive className="text-yellow-500" size={20} />;
      case 'txt': return <FileText className="text-green-500" size={20} />;
      default: return <File className="text-neutral-500" size={20} />;
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-neutral-500 font-mono animate-pulse">LOADING VAULT...</div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-[1800px] mx-auto w-full h-screen flex flex-col relative">
      <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter font-outfit">FILES</h1>
          <p className="text-cyan-500 tracking-[0.3em] uppercase text-xs font-mono">Secure Storage</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-2 clip-corner-tr disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isUploading ? 'UPLOADING...' : 'UPLOAD'}
          </button>
        </div>
      </header>

      <div className="flex-1 border border-white/15 bg-neutral-900/50 backdrop-blur-md relative overflow-hidden rounded-lg">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 bg-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
          <div className="col-span-5">Filename</div>
          <div className="col-span-3">Format</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {assets.length === 0 ? (
            <div className="p-12 text-center text-neutral-600 font-mono text-sm">NO ASSETS SECURED</div>
          ) : (
            assets.map(asset => (
              <div key={asset.id} className="grid grid-cols-12 gap-4 p-6 items-center border-b border-neutral-800 hover:bg-white/5 transition-colors group font-mono text-sm">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 border border-neutral-800 bg-black flex items-center justify-center rounded">
                    {getIcon(asset.type)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white font-medium uppercase tracking-wide truncate" title={asset.name}>{asset.name}</p>
                    <p className="text-neutral-600 text-xs mt-0.5">{asset.uploadDate}</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-neutral-500 uppercase text-xs bg-neutral-900 px-2 py-1 rounded">
                    {asset.type}
                  </span>
                </div>
                <div className="col-span-2 text-neutral-400">
                  {asset.size}
                </div>
                <div className="col-span-2 flex justify-end gap-3">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="text-neutral-500 hover:text-white transition-colors"
                    title="Open Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <a href={asset.url} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-cyan-400 transition-colors" title="Download">
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => handleDeleteAsset(asset.id, (asset as any).key)}
                    className="text-neutral-500 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-8">
          <div className="bg-[#0d0d0d] border border-white/20 w-full max-w-4xl h-[80vh] flex flex-col relative rounded-lg shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                {getIcon(previewAsset.type)}
                <h2 className="text-white font-bold uppercase tracking-wide truncate max-w-md">{previewAsset.name}</h2>
              </div>
              <button onClick={() => setPreviewAsset(null)} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden p-4">
              {previewAsset.type === 'image' && previewAsset.url ? (
                <img src={previewAsset.url} alt="Preview" className="max-w-full max-h-full object-contain" />
              ) : previewAsset.type === 'pdf' ? (
                <iframe src={previewAsset.url} className="w-full h-full border-0" title="PDF Preview"></iframe>
              ) : (
                <div className="text-center text-neutral-500">
                  <File size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="uppercase tracking-widest">Preview Not Supported</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080808] flex justify-end">
              <a
                href={previewAsset.url}
                download={previewAsset.name}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-black px-6 py-2 font-bold uppercase text-xs tracking-widest hover:bg-cyan-400 transition-colors"
              >
                Download File
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
