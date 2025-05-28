import { cardVariants, itemVariants } from '@/constants/animations';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Input } from 'antd';
import { motion } from 'framer-motion';
import React, { useRef } from 'react';

const { TextArea } = Input;

interface WriteEditorProps {
  title: string;
  excerpt: string;
  content: string;
  previewMode: boolean;
  onTitleChange: (title: string) => void;
  onExcerptChange: (excerpt: string) => void;
  onContentChange: (content: string) => void;
}

const WriteEditor: React.FC<WriteEditorProps> = ({
  title,
  excerpt,
  content,
  previewMode,
  onTitleChange,
  onExcerptChange,
  onContentChange,
}) => {
  const editorRef = useRef<Editor>(null);

  const handleEditorChange = () => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      const markdown = editorInstance.getMarkdown();
      onContentChange(markdown);
    }
  };

  return (
    <motion.div variants={itemVariants} className="lg:col-span-3 space-y-4">
      {/* 标题输入 */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <Input
          placeholder="请输入文章标题..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl font-semibold border-0 shadow-none p-0 placeholder:text-gray-400"
          style={{ fontSize: '20px', lineHeight: '1.4' }}
        />
      </motion.div>

      {/* 摘要输入 */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <TextArea
          placeholder="请输入文章摘要..."
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          rows={2}
          className="border-0 shadow-none resize-none placeholder:text-gray-400"
          style={{ fontSize: '14px' }}
        />
      </motion.div>

      {/* Toast UI Editor */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="h-[500px]">
          <Editor
            ref={editorRef}
            initialValue={content}
            previewStyle={previewMode ? 'vertical' : 'tab'}
            height="500px"
            initialEditType="markdown"
            useCommandShortcut={true}
            language="zh-CN"
            onChange={handleEditorChange}
            placeholder="开始写作..."
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WriteEditor;
