declare module '@uiw/react-md-editor' {
  import { FC } from 'react';

  interface MDEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    preview?: 'edit' | 'preview' | 'live';
    hideToolbar?: boolean;
    height?: number;
    'data-color-mode'?: 'light' | 'dark';
    [key: string]: any;
  }

  const MDEditor: FC<MDEditorProps>;
  export default MDEditor;
}