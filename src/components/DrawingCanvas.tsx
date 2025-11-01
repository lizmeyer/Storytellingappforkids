import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Eraser, Undo, Trash2, Sparkles, Palette } from 'lucide-react';

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  initialDrawing?: string;
}

export function DrawingCanvas({ onSave, initialDrawing }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const colors = ['#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load initial drawing if provided
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = initialDrawing;
    } else {
      saveToHistory();
    }
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? 'white' : color;
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newStep = historyStep - 1;
      setHistoryStep(newStep);

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newStep];
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    onSave(dataUrl);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setIsEraser(false);
  };

  const isCustomColor = !colors.includes(color) && !isEraser;

  return (
    <div className="space-y-4">
      {/* Color Palette */}
      <div>
        <div className="flex gap-2 justify-center flex-wrap items-center">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                color === c && !isEraser ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
          
          {/* Custom Color Picker */}
          <div className="relative">
            <input
              ref={colorPickerRef}
              type="color"
              value={color}
              onChange={handleCustomColorChange}
              className="absolute opacity-0 w-8 h-8 cursor-pointer"
              aria-label="Custom color picker"
            />
            <button
              onClick={() => colorPickerRef.current?.click()}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform relative overflow-hidden ${
                isCustomColor ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ 
                background: isCustomColor 
                  ? color 
                  : 'conic-gradient(from 90deg, red, yellow, lime, aqua, blue, magenta, red)'
              }}
              aria-label="Pick custom color"
            >
              {!isCustomColor && (
                <Palette className="w-4 h-4 text-white drop-shadow-md" />
              )}
            </button>
          </div>
          
          {/* Eraser */}
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${
              isEraser ? 'border-gray-800 scale-110 bg-white' : 'border-gray-300 bg-gray-100'
            }`}
            aria-label="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
        
        {/* Color Label */}
        {isCustomColor && (
          <p className="text-center text-xs text-gray-600 mt-2">
            Custom color: {color.toUpperCase()}
          </p>
        )}
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-4 border-purple-200 rounded-lg bg-white touch-none w-full"
          style={{ height: '400px' }}
        />
      </div>

      {/* Tools */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={historyStep <= 0}
          className="gap-2"
        >
          <Undo className="w-4 h-4" />
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2"
        size="lg"
      >
        <Sparkles className="w-5 h-5" />
        Save Drawing
      </Button>
    </div>
  );
}