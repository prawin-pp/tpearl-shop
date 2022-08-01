declare class Tooltip {
  constructor(targetElement: HTMLElement, triggerElement: HTMLElement, options?: TooltipOption);
  _options: TooltipOption;
  show(): void;
  hide(): void;
}

type TooltipOption = {
  placement?: 'top' | 'right' | 'bottom' | 'left';
  triggerType?: 'hover' | 'click';
  onHide?: () => void;
  onShow?: () => void;
};

declare class Modal {
  constructor(targetElement: HTMLElement, options?: ModalOption);
  _options: ModalOption;
  show(): void;
  hide(): void;
  toggle(): void;
}

type ModalOption = {
  placement: `${'top' | 'center' | 'right'}-${'left' | 'center' | 'right'}`;
  backdropClasses: string;
  onHide(): void;
  onShow(): void;
  onToggle(): void;
};
