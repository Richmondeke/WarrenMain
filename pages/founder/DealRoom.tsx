import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { Document } from '../../types';
import { dataService } from '../../services/dataService';
import { EmptyState } from '../../components/EmptyState';
import { FileText, CheckCircle, Upload, Clock, File } from 'lucide-react';
import { clsx } from 'clsx';
import { MOCK_STARTUPS } from '../../constants';

export const DealRoom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'checklist'>('docs');
  const [docs, setDocs] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  // Use the ID of the first mock startup which is now a valid UUID
  const currentStartupId = MOCK_STARTUPS[0].id;

  useEffect(() => {
    dataService.getDocuments(currentStartupId).then(setDocs);
  }, [currentStartupId]);

  const handleSimulateUpload = async () => {
    setUploading(true);
    try {
        const newDoc = await dataService.uploadDocument({ 
            startup_id: currentStartupId,
            name: 'New Due Diligence Item', 
            type: 'PDF', 
            size: '3.2 MB' 
        });
        setDocs(prev => [newDoc, ...prev]);
    } catch (e) {
        console.error("Upload failed", e);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Deal Room</h2>
        <div className="flex bg-white/5 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('docs')}
            className={clsx("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'docs' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}
          >
            Documents
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
             className={clsx("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'checklist' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}
          >
            Checklist
          </button>
        </div>
      </div>

      <GlassCard className="min-h-[500px]">
        {activeTab === 'docs' ? (
          <div className="space-y-4">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-white">Data Room Files</h3>
                <button 
                  onClick={handleSimulateUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm text-white transition-colors"
                >
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
             </div>
             {docs.length > 0 ? (
                 <div className="space-y-2">
                    {docs.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">{doc.name}</p>
                            <p className="text-xs text-slate-500">{doc.size} • {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={clsx(
                          "text-xs px-2 py-1 rounded border",
                          doc.status === 'Ready' ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" : "border-yellow-500/20 text-yellow-400 bg-yellow-500/10"
                        )}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                 </div>
             ) : (
                 <EmptyState 
                    icon={File}
                    title="No Documents Uploaded"
                    description="Your data room is empty. Upload documents to share with interested investors."
                    action={{ label: "Upload First Document", onClick: handleSimulateUpload }}
                 />
             )}
          </div>
        ) : (
          <div className="space-y-6">
             <div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
               <h4 className="font-bold text-emerald-400 mb-2">Deal Status: On Track</h4>
               <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full w-[65%]"></div>
               </div>
               <p className="text-right text-xs text-emerald-500 mt-1">65% Complete</p>
             </div>

             <div className="space-y-3">
               {[
                 { label: 'Corporate Structure', done: true },
                 { label: 'Intellectual Property', done: true },
                 { label: 'Financial Statements (Last 2 Years)', done: false },
                 { label: 'Employment Agreements', done: true },
                 { label: 'Cap Table Verification', done: false },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    {item.done ? <CheckCircle className="text-emerald-500" size={20} /> : <Clock className="text-slate-500" size={20} />}
                    <span className={clsx("text-sm", item.done ? "text-slate-300 line-through decoration-slate-600" : "text-white")}>{item.label}</span>
                 </div>
               ))}
             </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};