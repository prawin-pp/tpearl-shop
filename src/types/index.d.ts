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
