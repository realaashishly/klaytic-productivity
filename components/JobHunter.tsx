
import React, { useState } from 'react';
import { Briefcase, Search, MapPin, Building2, Loader2, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { findJobs } from '../services/geminiService';
import { JobOpportunity } from '../types';

const JobHunter: React.FC = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);

  const handleSearch = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setJobs([]);
    try {
      const results = await findJobs(role);
      setJobs(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-[1800px] mx-auto w-full h-full flex flex-col relative">
      <header className="mb-12 border-b border-white/10 pb-6">
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter font-outfit">JOBS</h1>
        <p className="text-cyan-500 tracking-[0.3em] uppercase text-xs font-mono">Opportunity Database</p>
      </header>

      <div className="flex flex-col items-center mb-12">
        <div className="relative w-full max-w-3xl group">
           <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 blur group-hover:opacity-40 transition-opacity duration-500"></div>
           <div className="relative bg-black border border-white/20 flex items-center">
               <span className="pl-6 text-cyan-500 font-mono text-lg font-bold">{`>>`}</span>
               <input 
                 type="text"
                 value={role}
                 onChange={(e) => setRole(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                 placeholder="SEARCH (ROLE, LOCATION)..."
                 className="w-full bg-transparent py-6 px-4 text-xl text-white font-mono uppercase placeholder-neutral-700 outline-none"
               />
               <button 
                 onClick={handleSearch}
                 disabled={loading || !role}
                 className="bg-white text-black px-8 py-6 font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors disabled:opacity-50 text-sm"
               >
                 {loading ? <Loader2 className="animate-spin" size={16} /> : "SEARCH"}
               </button>
           </div>
        </div>
      </div>

      {/* Data Grid Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-2 border-b border-neutral-800 text-[10px] font-bold text-neutral-600 uppercase tracking-widest font-mono">
          <div className="col-span-4">Role / Company</div>
          <div className="col-span-3">Location</div>
          <div className="col-span-3">Salary</div>
          <div className="col-span-2 text-right">Action</div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
         {jobs.map(job => (
           <div key={job.id} className="grid grid-cols-12 gap-4 p-6 border-b border-neutral-900 items-center hover:bg-white/5 transition-colors group font-mono">
              
              <div className="col-span-4">
                  <h3 className="text-lg font-bold text-white mb-1 uppercase group-hover:text-cyan-400 transition-colors truncate">{job.role}</h3>
                  <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase">
                      <Building2 size={12} /> {job.company}
                  </div>
              </div>

              <div className="col-span-3 space-y-1">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase">
                      <MapPin size={12} /> {job.location}
                  </div>
              </div>

              <div className="col-span-3">
                  <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                      <DollarSign size={12} /> {job.salaryRange || "N/A"}
                  </div>
              </div>

              <div className="col-span-2 flex justify-end">
                  <a 
                    href={job.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="border border-neutral-700 text-neutral-400 px-4 py-2 text-[10px] uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-500 transition-all flex items-center gap-2"
                  >
                    OPEN <ExternalLink size={10} />
                  </a>
              </div>
           </div>
         ))}
         
         {!loading && jobs.length === 0 && (
           <div className="flex flex-col items-center justify-center text-neutral-800 py-20 border border-dashed border-neutral-900 mt-4 bg-[#0d0d0d]">
              <Briefcase size={48} className="mb-4 opacity-20" />
              <p className="font-mono text-xs uppercase tracking-widest">NO JOBS FOUND</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default JobHunter;
