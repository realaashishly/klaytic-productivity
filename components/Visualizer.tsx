import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download, Wand2 } from 'lucide-react';
import { generateVisualization } from '../services/geminiService';
import { GeneratedImage } from '../types';

const Visualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const url = await generateVisualization(prompt);
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        prompt,
        createdAt: new Date()
      };
      setGallery(prev => [newImage, ...prev]);
      setSelectedImage(url);
      setPrompt('');
    } catch (err) {
      alert('Error generating image. Ensure your API key has access to Gemini 2.5 Flash Image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full flex flex-col">
       <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
           <Wand2 className="mr-3 text-yellow-400" /> Visualizer
        </h1>
        <p className="text-slate-400">
          Generate concept art and project assets using <span className="text-yellow-400 font-mono">gemini-2.5-flash-image</span> (Nano Banana).
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Input Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <label className="block text-sm font-medium text-slate-300 mb-2">Creative Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic dashboard interface with neon blue accents..."
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-xl font-medium flex justify-center items-center transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <ImageIcon className="mr-2" />}
              {loading ? 'Painting...' : 'Generate Asset'}
            </button>
          </div>

          {/* History Grid */}
          <div className="grid grid-cols-2 gap-4">
            {gallery.map(img => (
              <button 
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-transparent hover:border-slate-600'}`}
              >
                <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 to-slate-950"></div>
          
          {selectedImage ? (
            <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-center">
               <img 
                 src={selectedImage} 
                 alt="Generated Result" 
                 className="max-w-full max-h-[600px] rounded-lg shadow-2xl shadow-black"
               />
               <div className="mt-6 flex gap-4">
                 <a 
                   href={selectedImage} 
                   download={`nexus-gen-${Date.now()}.png`}
                   className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
                 >
                   <Download size={16} />
                   <span>Download PNG</span>
                 </a>
               </div>
            </div>
          ) : (
            <div className="relative z-10 text-center text-slate-600">
              <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
              <p>No image selected. Generate something amazing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;