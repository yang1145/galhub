import { X } from '@phosphor-icons/react';

interface LightboxProps {
  image: string;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  return (
    <button className="lightbox" onClick={onClose} aria-label="关闭截图预览">
      <X size={28} weight="bold" />
      <img src={image} alt="游戏截图预览" />
    </button>
  );
}
