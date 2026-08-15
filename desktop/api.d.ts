type DesktopQuickNote = {
  id: number;
  title: string;
  body: string;
  tag: string;
  time: string;
  color: string;
  date: string;
  createdAt: string;
};

interface Window {
  zaineDesktop?: {
    isDesktop: boolean;
    showQuickWidget: () => void;
    onQuickNoteSaved: (callback: (note: DesktopQuickNote) => void) => () => void;
  };
  zaineWidget?: {
    setExpanded: (expanded: boolean) => void;
    moveBy: (deltaX: number, deltaY: number) => void;
    saveNote: (note: DesktopQuickNote) => void;
    onExpandedState: (callback: (expanded: boolean) => void) => () => void;
  };
}
