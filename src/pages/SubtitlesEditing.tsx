import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiFileText, FiType, FiGlobe, FiPlay, FiDownload, FiPlus, FiTrash2,
  FiEdit3, FiClock, FiChevronDown, FiCheck, FiSave, FiUpload, FiCopy
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { SubtitleUploader } from '../components/Subtitles/SubtitleUploader';
import { TranslationTools } from '../components/Subtitles/TranslationTools';
import { useSubtitles } from '../contexts/SubtitleContext';
import { useVideo } from '../contexts/VideoContext';
import { DialogBox } from '../components/Common/DialogBox';
import { v4 as uuidv4 } from 'uuid';

// Subtitle Tools
const subtitleTools = [
  { id: 'add', icon: <FiPlus />, label: 'Add', color: 'from-blue-500 to-blue-600' },
  { id: 'edit', icon: <FiEdit3 />, label: 'Edit', color: 'from-green-500 to-green-600' },
  { id: 'delete', icon: <FiTrash2 />, label: 'Delete', color: 'from-red-500 to-red-600' },
  { id: 'import', icon: <FiUpload />, label: 'Import', color: 'from-purple-500 to-purple-600' },
  { id: 'export', icon: <FiDownload />, label: 'Export', color: 'from-orange-500 to-orange-600' },
  { id: 'translate', icon: <FiGlobe />, label: 'Translate', color: 'from-teal-500 to-teal-600' },
  { id: 'font', icon: <FiType />, label: 'Font', color: 'from-pink-500 to-pink-600' },
  { id: 'timing', icon: <FiClock />, label: 'Timing', color: 'from-indigo-500 to-indigo-600' },
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];
const fontFamilies = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Arial', 'Times New Roman', 'Georgia'];

const SubtitlesEditing: React.FC = () => {
  const navigate = useNavigate();
  const { subtitles, addSubtitle, updateSubtitle, deleteSubtitle, subtitleStyle } = useSubtitles();
  const { currentVideo } = useVideo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Tool states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<any>(null);
  
  // Add subtitle form
  const [newStartTime, setNewStartTime] = useState('00:00:00');
  const [newEndTime, setNewEndTime] = useState('00:00:05');
  const [newText, setNewText] = useState('');
  
  // Font settings
  const [fontSize, setFontSize] = useState(subtitleStyle.fontSize || 24);
  const [fontFamily, setFontFamily] = useState(subtitleStyle.fontFamily || 'Inter');
  const [fontColor, setFontColor] = useState(subtitleStyle.color || '#ffffff');
  const [bgColor, setBgColor] = useState(subtitleStyle.backgroundColor || 'rgba(0,0,0,0.7)');
  const [textAlign, setTextAlign] = useState(subtitleStyle.textAlign || 'center');

  const handleAddSubtitle = () => {
    if (!newText.trim()) return;
    
    addSubtitle({
      id: uuidv4(),
      startTime: parseTimeToSeconds(newStartTime),
      endTime: parseTimeToSeconds(newEndTime),
      text: newText
    });
    
    setNewText('');
    setShowAddDialog(false);
  };

  const handleEditSubtitle = () => {
    if (!selectedSubtitle || !newText.trim()) return;
    
    updateSubtitle(selectedSubtitle.id, {
      startTime: parseTimeToSeconds(newStartTime),
      endTime: parseTimeToSeconds(newEndTime),
      text: newText
    });
    
    setShowEditDialog(false);
    setSelectedSubtitle(null);
  };

  const openEditDialog = (subtitle: any) => {
    setSelectedSubtitle(subtitle);
    setNewStartTime(formatSecondsToTime(subtitle.startTime));
    setNewEndTime(formatSecondsToTime(subtitle.endTime));
    setNewText(subtitle.text);
    setShowEditDialog(true);
  };

  const parseTimeToSeconds = (time: string): number => {
    const parts = time.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const formatSecondsToTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const applyFontStyle = () => {
    // Font settings are already applied through context
    setShowFontDialog(false);
  };

  const handleToolClick = (toolId: string) => {
    switch (toolId) {
      case 'add':
        setNewStartTime('00:00:00');
        setNewEndTime('00:00:05');
        setNewText('');
        setShowAddDialog(true);
        break;
      case 'edit':
        if (subtitles.length > 0) {
          openEditDialog(subtitles[0]);
        }
        break;
      case 'import':
        // Trigger file input click
        document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
        break;
      case 'export':
        exportSubtitles();
        break;
      case 'translate':
        // Already shown in sidebar
        break;
      case 'font':
        setShowFontDialog(true);
        break;
    }
  };

  const exportSubtitles = () => {
    const content = subtitles.map((sub, i) => {
      return `${i + 1}\n${formatSecondsToTime(sub.startTime)} --> ${formatSecondsToTime(sub.endTime)}\n${sub.text}\n`;
    }).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitles.srt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <HamburgerMenu onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-20 px-4 pb-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Subtitle Editor</h1>
              <p className="text-white/60 text-sm">{subtitles.length} subtitles • Click to edit</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/video-editing')} variant="secondary" size="sm">
                ← Back
              </Button>
              {subtitles.length > 0 && (
                <Button onClick={() => navigate('/create-video')} size="sm">
                  Render →
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-4">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-3"
            >
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <FiPlay className="text-accent-500 text-xs" />
                Preview
              </h3>
              
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {currentVideo ? (
                    <p className="text-white/30">Video + Subtitle Preview</p>
                  ) : (
                    <div className="text-center">
                      <FiFileText className="text-4xl text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 text-sm">Upload video to preview</p>
                    </div>
                  )}
                </div>
                
                {/* Subtitle Preview */}
                {subtitles.length > 0 && (
                  <div 
                    className="absolute bottom-8 left-4 right-4 text-center"
                    style={{ 
                      fontFamily: fontFamily,
                      fontSize: `${fontSize}px`,
                      color: fontColor,
                      backgroundColor: bgColor,
                      textAlign: textAlign as any
                    }}
                  >
                    <span className="px-4 py-2 rounded-lg inline-block">
                      {subtitles[0]?.text || 'Subtitle preview'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Subtitle Tools Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <FiFileText className="text-accent-500 text-xs" />
                  Tools
                </h3>
              </div>
              
              <div className="grid grid-cols-8 gap-2">
                {subtitleTools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToolClick(tool.id)}
                    className={`p-2 rounded-lg bg-gradient-to-r ${tool.color} text-white text-center transition-all shadow-md hover:shadow-lg`}
                  >
                    <div className="text-lg mb-1">{tool.icon}</div>
                    <div className="text-xs font-medium">{tool.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Subtitle List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">Subtitle List</h3>
                <span className="text-xs text-white/50">{subtitles.length} items</span>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {subtitles.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <FiFileText className="text-3xl mx-auto mb-2" />
                    <p className="text-sm">No subtitles yet</p>
                    <p className="text-xs mt-1">Click Add to create or Import to load</p>
                  </div>
                ) : (
                  subtitles.map((sub, index) => (
                    <div
                      key={sub.id}
                      onClick={() => openEditDialog(sub)}
                      className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-3"
                    >
                      <span className="w-8 h-8 rounded-full bg-accent-500/20 text-accent-500 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{sub.text}</p>
                        <p className="text-xs text-white/50">
                          {formatSecondsToTime(sub.startTime)} - {formatSecondsToTime(sub.endTime)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSubtitle(sub.id);
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <div className="card p-3">
              <h3 className="font-semibold text-white text-sm mb-3">Import</h3>
              <SubtitleUploader />
            </div>

            <div className="card p-3">
              <h3 className="font-semibold text-white text-sm mb-3">Font Style</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Font Size</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-12 text-right">{fontSize}px</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="input-field text-sm"
                  >
                    {fontFamilies.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Text Color</label>
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Background</label>
                  <input
                    type="color"
                    value={bgColor.startsWith('rgba') ? '#000000' : bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => setTextAlign(align)}
                      className={`p-2 rounded-lg text-xs uppercase ${
                        textAlign === align
                          ? 'bg-accent-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-3">
              <h3 className="font-semibold text-white text-sm mb-3">Translation</h3>
              <TranslationTools />
            </div>
          </div>
        </div>
      </div>

      {/* Add Subtitle Dialog */}
      <DialogBox
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        title="Add Subtitle"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1 block">Start Time</label>
            <input
              type="text"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="input-field"
              placeholder="00:00:00"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">End Time</label>
            <input
              type="text"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="input-field"
              placeholder="00:00:05"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Text</label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="input-field min-h-24 resize-none"
              placeholder="Enter subtitle text..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setShowAddDialog(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleAddSubtitle} className="btn-primary flex-1">
              <FiPlus className="mr-1" /> Add
            </button>
          </div>
        </div>
      </DialogBox>

      {/* Edit Subtitle Dialog */}
      <DialogBox
        isOpen={showEditDialog}
        onClose={() => { setShowEditDialog(false); setSelectedSubtitle(null); }}
        title="Edit Subtitle"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1 block">Start Time</label>
            <input
              type="text"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="input-field"
              placeholder="00:00:00"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">End Time</label>
            <input
              type="text"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="input-field"
              placeholder="00:00:05"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Text</label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="input-field min-h-24 resize-none"
              placeholder="Enter subtitle text..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setShowEditDialog(false); setSelectedSubtitle(null); }} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleEditSubtitle} className="btn-primary flex-1">
              <FiCheck className="mr-1" /> Save
            </button>
          </div>
        </div>
      </DialogBox>

      {/* Font Dialog */}
      <DialogBox
        isOpen={showFontDialog}
        onClose={() => setShowFontDialog(false)}
        title="Font Settings"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Font Size: {fontSize}px</label>
            <div className="grid grid-cols-7 gap-1">
              {fontSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`p-2 rounded text-center text-xs ${
                    fontSize === size
                      ? 'bg-accent-500 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-white/70 mb-2 block">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="input-field"
            >
              {fontFamilies.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70 mb-2 block">Text Color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-2 block">Background</label>
            <input
              type="color"
              value={bgColor.startsWith('rgba') ? '#000000' : bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setShowFontDialog(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={applyFontStyle} className="btn-primary flex-1">
              Apply
            </button>
          </div>
        </div>
      </DialogBox>
    </div>
  );
};

export default SubtitlesEditing;