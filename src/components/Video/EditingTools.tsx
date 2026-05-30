import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiScissors, FiRotateCw, FiClock,
  FiType, FiFilter, FiZap, FiChevronDown, FiCheck
} from 'react-icons/fi';
import { DialogBox } from '../Common/DialogBox';

interface ToolOption {
  id: string;
  label: string;
  value: string;
}

const toolOptions: Record<string, ToolOption[]> = {
  trim: [
    { id: 'start', label: 'Start Time', value: '00:00:00' },
    { id: 'end', label: 'End Time', value: '00:00:10' },
  ],
  speed: [
    { id: '0.25x', label: '0.25x (Slow)', value: '0.25' },
    { id: '0.5x', label: '0.5x (Slow)', value: '0.5' },
    { id: '1x', label: '1x (Normal)', value: '1' },
    { id: '1.5x', label: '1.5x (Fast)', value: '1.5' },
    { id: '2x', label: '2x (Faster)', value: '2' },
    { id: '4x', label: '4x (Fastest)', value: '4' },
  ],
  rotate: [
    { id: '90', label: '90° Clockwise', value: '90' },
    { id: '180', label: '180° Flip', value: '180' },
    { id: '270', label: '270° Clockwise', value: '270' },
  ],
};

interface Tool {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  hasOptions?: boolean;
}

const tools: Tool[] = [
  { id: 'trim', icon: <FiScissors />, label: 'Trim', description: 'Cut video segments', hasOptions: true },
  { id: 'speed', icon: <FiZap />, label: 'Speed', description: 'Adjust playback speed', hasOptions: true },
  { id: 'rotate', icon: <FiRotateCw />, label: 'Rotate', description: 'Rotate video', hasOptions: true },
  { id: 'text', icon: <FiType />, label: 'Text', description: 'Add text overlay' },
  { id: 'filter', icon: <FiFilter />, label: 'Filter', description: 'Apply filters' },
  { id: 'time', icon: <FiClock />, label: 'Time', description: 'Time effects' },
];

export const EditingTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [toolSettings, setToolSettings] = useState<Record<string, string>>({});
  const [showDialog, setShowDialog] = useState(false);

  const openToolDialog = (toolId: string) => {
    setSelectedTool(toolId);
    setShowDialog(true);
    // Initialize default settings
    if (toolId === 'trim') {
      setToolSettings({ start: '00:00:00', end: '00:00:10' });
    } else if (toolId === 'speed') {
      setToolSettings({ speed: '1' });
    } else if (toolId === 'rotate') {
      setToolSettings({ angle: '90' });
    }
  };

  const handleApply = () => {
    // Apply tool settings
    console.log('Applying tool:', selectedTool, toolSettings);
    setShowDialog(false);
    setSelectedTool(null);
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

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
            onClick={() => tool.hasOptions ? openToolDialog(tool.id) : null}
            className="p-4 rounded-xl border bg-white/5 border-white/10 hover:border-white/30 transition-all text-left relative"
          >
            <div className="text-2xl mb-2 text-white/70">{tool.icon}</div>
            <h4 className="font-medium text-white">{tool.label}</h4>
            <p className="text-xs text-white/50 mt-1">{tool.description}</p>
            {tool.hasOptions && (
              <div className="absolute top-2 right-2">
                <FiChevronDown className="text-white/30 text-sm" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tool Settings Dialog */}
      <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title={`${selectedToolData?.label || 'Tool'} Settings`}
        size="md"
      >
        <div className="space-y-4">
          {selectedTool === 'trim' && (
            <>
              <div>
                <label className="text-sm text-white/70 mb-2 block">Start Time</label>
                <input
                  type="text"
                  value={toolSettings.start || '00:00:00'}
                  onChange={(e) => setToolSettings({ ...toolSettings, start: e.target.value })}
                  className="input-field"
                  placeholder="00:00:00"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-2 block">End Time</label>
                <input
                  type="text"
                  value={toolSettings.end || '00:00:10'}
                  onChange={(e) => setToolSettings({ ...toolSettings, end: e.target.value })}
                  className="input-field"
                  placeholder="00:00:10"
                />
              </div>
            </>
          )}

          {selectedTool === 'speed' && (
            <div>
              <label className="text-sm text-white/70 mb-3 block">Select Speed</label>
              <div className="grid grid-cols-2 gap-2">
                {toolOptions.speed.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setToolSettings({ speed: option.value })}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      toolSettings.speed === option.value
                        ? 'bg-accent-500/20 border-accent-500'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-white">{option.label}</span>
                    {toolSettings.speed === option.value && (
                      <FiCheck className="text-accent-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTool === 'rotate' && (
            <div>
              <label className="text-sm text-white/70 mb-3 block">Rotation Angle</label>
              <div className="flex gap-2">
                {['90', '180', '270'].map(angle => (
                  <button
                    key={angle}
                    onClick={() => setToolSettings({ angle })}
                    className={`flex-1 p-4 rounded-xl border transition-all ${
                      toolSettings.angle === angle
                        ? 'bg-accent-500/20 border-accent-500'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xl text-white font-bold">{angle}°</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowDialog(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleApply} className="btn-primary flex-1">
              Apply
            </button>
          </div>
        </div>
      </DialogBox>
    </div>
  );
};

export default EditingTools;