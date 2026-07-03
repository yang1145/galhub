import { ArrowSquareOut, DownloadSimple, GlobeHemisphereWest, Play } from '@phosphor-icons/react';
import type { ButtonType } from '../types/game';

const buttonIcons: Record<ButtonType, React.ElementType> = {
  download: DownloadSimple,
  website: GlobeHemisphereWest,
  play: Play,
};

const buttonTone: Record<ButtonType, string> = {
  download: 'action-download',
  website: 'action-website',
  play: 'action-play',
};

interface ActionButtonProps {
  button: { type: ButtonType; label: string; url: string };
}

export function ActionButton({ button }: ActionButtonProps) {
  const Icon = buttonIcons[button.type];

  return (
    <a className={`action-button ${buttonTone[button.type]}`} href={button.url} target="_blank" rel="noreferrer">
      <Icon size={20} weight="bold" />
      {button.label}
      <ArrowSquareOut size={16} weight="bold" />
    </a>
  );
}
