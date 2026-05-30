import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiScissors, FiMove, FiRotateCw, FiClock,
  FiType, FiFilter, FiZap
} from 'react-icons/fi';

interface Tool {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const tools: Tool[] = [
  { id: 'trim', icon: <FiScissors />, label: 'Trim', description: 'Cut video segments' },
  { id: 'speed', icon: <FiZap />, label: 'Speed', description: 'Adjust playback speed' },
  { id: 'rotate', icon: <FiRotateCw />, label: 'Rotate', description: 'Rotate video' },
  { id: 'text', icon: <FiType />, label: 'Text', description: 'Add text overlay' },
  { id: 'filter', icon: <FiFilter />, label: 'Filter', description: 'Apply filters' },
  { id: 'time', icon: <FiClock />, label: 'Time', description: 'Time effects' },
];

export const EditingTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FiScissors className="text-accent-500" />
        Editing Tools
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedTool === tool.id
                ? 'bg-accent-500/20 border-accent-500'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            <div className={`text-2xl mb-2 ${selectedTool === tool.id ? 'text-accent-500' : 'text-white/70'}`}>
              {tool.icon}
            </div>
            <h4 className="font-medium text-white">{tool.label}</h4>
            <p className="text-xs text-white/50 mt-1">{tool.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Tool Options */}
      {selectedTool && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card p-4 mt-4"
        >
          <h4 className="font-medium text-white mb-3">
            {tools.find(t => t.id === selectedTool)?.label} Options
          </h4>
          
          {selectedTool === 'trim' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-white/70">Start Time</label>
                <input type="time" className="input-field mt-1" step="0.01" />
              </div>
              <div>
                <label className="text-sm text-white/70">End Time</label>
                <input type="time" className="input-field mt-1" step="0.01" />
              </div>
            </div>
          )}

          {selectedTool === 'speed' && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-white/70">Speed Factor</label>
                <input type="range" min="0.25" max="4" step="0.25" className="w-full" />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>0.25x</span>
                  <span>1x</span>
                  <span>4x</span>
                </div>
              </div>
            </div>
          )}

          {selectedTool === 'rotate' && (
            <div className="flex gap-2">
              {['90°', '180°', '270°'].map((angle) => (
                <button key={angle} className="btn-secondary flex-1">
                  {angle}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EditingTools;