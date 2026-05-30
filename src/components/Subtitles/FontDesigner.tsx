import React from 'react';
import { FiType, FiBold, FiItalic, FiAlignLeft, FiAlignCenter, FiAlignRight } from 'react-icons/fi';
import { useSubtitles } from '../../contexts/SubtitleContext';

const fontFamilies = ['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'];
const fontSizes = [16, 18, 20, 24, 28, 32, 36, 42];
const fontColors = ['#ffffff', '#000000', '#ffff00', '#00ffff', '#ff00ff', '#ff0000', '#00ff00'];
const positions = ['top', 'center', 'bottom'];

export const FontDesigner: React.FC = () => {
  const { style, setStyle } = useSubtitles();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FiType className="text-accent-500" />
        Subtitle Style
      </h3>

      {/* Font Family */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Font Family</label>
        <select
          value={style.fontFamily}
          onChange={(e) => setStyle({ fontFamily: e.target.value })}
          className="input-field"
          style={{ fontFamily: style.fontFamily }}
        >
          {fontFamilies.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Font Size</label>
        <div className="flex gap-2 flex-wrap">
          {fontSizes.map(size => (
            <button
              key={size}
              onClick={() => setStyle({ fontSize: size })}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                style.fontSize === size
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* Font Color */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Font Color</label>
        <div className="flex gap-2 flex-wrap">
          {fontColors.map(color => (
            <button
              key={color}
              onClick={() => setStyle({ fontColor: color })}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                style.fontColor === color ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Text Style */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Text Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => setStyle({ bold: !style.bold })}
            className={`p-3 rounded-lg transition-colors ${
              style.bold ? 'bg-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <FiBold />
          </button>
          <button
            onClick={() => setStyle({ italic: !style.italic })}
            className={`p-3 rounded-lg transition-colors ${
              style.italic ? 'bg-accent-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <FiItalic />
          </button>
        </div>
      </div>

      {/* Position */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Position</label>
        <div className="flex gap-2">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setStyle({ position: pos as 'top' | 'center' | 'bottom' })}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                style.position === pos
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {pos === 'top' && <FiAlignLeft />}
              {pos === 'center' && <FiAlignCenter />}
              {pos === 'bottom' && <FiAlignRight />}
              <span className="capitalize">{pos}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Background */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Background</label>
        <input
          type="color"
          value={style.backgroundColor?.replace(/rgba?\([^)]+\)/, '#000000') || '#000000'}
          onChange={(e) => setStyle({ backgroundColor: e.target.value + '99' })}
          className="w-full h-12 rounded-lg cursor-pointer"
        />
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 bg-black/50 rounded-xl text-center">
        <p
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            color: style.fontColor,
            backgroundColor: style.backgroundColor,
            fontWeight: style.bold ? 'bold' : 'normal',
            fontStyle: style.italic ? 'italic' : 'normal',
          }}
        >
          Preview Subtitle
        </p>
      </div>
    </div>
  );
};

export default FontDesigner;