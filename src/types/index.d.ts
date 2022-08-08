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

declare module 'flowbite-datepicker' {
  export class Datepicker {
    constructor(targetElement: HTMLElement, options?: DatePickerOption);

    static locales: Record<string, Object>;

    element: HTMLElement;
  }
  export class DateRangePicker {
    constructor(targetElement: HTMLElement, options?: DatePickerOption);
  }

  export type DatePickerOption = {
    format?: string;
    language?: 'en' | 'th';
    maxDate?: string | 'today' | Date;
    todayBtn?: boolean;
    clearBtn?: boolean;
    autohide?: boolean;
  };
}

interface IDatePickerChangeEvent {
  date: Date;
  datepicker: import('flowbite-datepicker').Datepicker;
  viewDate: Date;
  viewId: number;
}

declare namespace svelte.JSX {
  interface SvelteInputProps {
    onchangeDate?: (e: CustomEvent<IDatePickerChangeEvent>) => void;
  }
}
