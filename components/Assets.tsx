
import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, Film, FileArchive, Download, File, X, Eye } from 'lucide-react';
import { Asset } from '../types';

const MOCK_ASSETS: Asset[] = [
  { id: '1', name: 'Project_Titan_Blueprint.pdf', size: '2.4 MB', type: 'pdf', uploadDate: '2023-10-24' },
  { id: '2', name: 'Hero_Banner_V3.png', size: '4.1 MB', type: 'image', uploadDate: '2023-10-25', url: 'https://images.unsplash.com/photo-1614728853913-1e22105175e0?q=80&w=2574&auto=format&fit=crop' },
];

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Create a fake upload entry
          const newAsset: Asset = {
              id: Math.random().toString(),
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              type: getFileType(file.type),
              uploadDate: new Date().toISOString().split('T')[0],
              url: URL.createObjectURL(file) // For local preview
          };
          setAssets([newAsset, ...assets]);
      }
  };

  const getFileType = (mime: string): Asset['type'] => {
      if (mime.includes('image')) return 'image';
      if (mime.includes('pdf')) return 'pdf';
      if (mime.includes('video')) return 'video';
      if (mime.includes('zip') || mime.includes('rar')) return 'zip';
      if (mime.includes('text')) return 'txt';
      return 'other';
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="text-red-500" size={20} />;
      case 'image': return <ImageIcon className="text-purple-500" size={20} />;
      case 'video': return <Film className="text-cyan-500" size={20} />;
      case 'zip': return <FileArchive className="text-yellow-500" size={20} />;
      case 'txt': return <FileText className="text-green-500" size={20} />;
      default: return <File className="text-neutral-500" size={20} />;
    }
  };

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
                className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-2 clip-corner-tr"
            >
                <Upload size={16} /> UPLOAD
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
           {assets.map(asset => (
             <div key={asset.id} className="grid grid-cols-12 gap-4 p-6 items-center border-b border-neutral-800 hover:bg-white/5 transition-colors group font-mono text-sm">
                <div className="col-span-5 flex items-center gap-4">
                   <div className="w-10 h-10 border border-neutral-800 bg-black flex items-center justify-center rounded">
                      {getIcon(asset.type)}
                   </div>
                   <div>
                      <p className="text-white font-medium uppercase tracking-wide truncate">{asset.name}</p>
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
                   <button className="text-neutral-500 hover:text-cyan-400 transition-colors" title="Download">
                      <Download size={16} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-8">
              <div className="bg-[#0d0d0d] border border-white/20 w-full max-w-4xl h-[80vh] flex flex-col relative rounded-lg shadow-2xl">
                  <div className="flex justify-between items-center p-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                          {getIcon(previewAsset.type)}
                          <h2 className="text-white font-bold uppercase tracking-wide">{previewAsset.name}</h2>
                      </div>
                      <button onClick={() => setPreviewAsset(null)} className="text-neutral-500 hover:text-white"><X size={24} /></button>
                  </div>
                  
                  <div className="flex-1 bg-black flex items-center justify-center overflow-hidden p-4">
                      {previewAsset.type === 'image' && previewAsset.url ? (
                          <img src={previewAsset.url} alt="Preview" className="max-w-full max-h-full object-contain" />
                      ) : previewAsset.type === 'pdf' ? (
                          <div className="text-center text-neutral-500">
                              <FileText size={64} className="mx-auto mb-4 opacity-50"/>
                              <p className="uppercase tracking-widest">PDF Preview Unavailable in Demo</p>
                          </div>
                      ) : (
                          <div className="text-center text-neutral-500">
                               <File size={64} className="mx-auto mb-4 opacity-50"/>
                               <p className="uppercase tracking-widest">Preview Not Supported</p>
                          </div>
                      )}
                  </div>

                  <div className="p-4 border-t border-white/10 bg-[#080808] flex justify-end">
                      <a 
                        href={previewAsset.url} 
                        download={previewAsset.name}
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
