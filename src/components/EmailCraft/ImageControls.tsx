import { RotateCw, Maximize2, Square } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ImageSettings } from './types';

interface ImageControlsProps {
  settings: ImageSettings;
  onChange: (settings: ImageSettings) => void;
}

export const ImageControls = ({ settings, onChange }: ImageControlsProps) => {
  return (
    <div className="space-y-4 p-3 bg-secondary/30 rounded-xl border border-border">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3" /> Size
          </label>
          <span className="text-[10px] font-bold text-foreground">{settings.size}px</span>
        </div>
        <Slider
          value={[settings.size]}
          onValueChange={([value]) => onChange({ ...settings, size: value })}
          min={40}
          max={150}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <RotateCw className="w-3 h-3" /> Rotation
          </label>
          <span className="text-[10px] font-bold text-foreground">{settings.rotation}°</span>
        </div>
        <Slider
          value={[settings.rotation]}
          onValueChange={([value]) => onChange({ ...settings, rotation: value })}
          min={0}
          max={360}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <Square className="w-3 h-3" /> Border Radius
          </label>
          <span className="text-[10px] font-bold text-foreground">{settings.borderRadius}px</span>
        </div>
        <Slider
          value={[settings.borderRadius]}
          onValueChange={([value]) => onChange({ ...settings, borderRadius: value })}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
