import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Download, Code2, X } from 'lucide-react';

const CodeViewer = ({ codeSnippets, isOpen, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = codeSnippets?.[selectedLanguage] || '// No code available for this language';

  const languages = [
    { id: 'cpp', name: 'C++'},
    { id: 'java', name: 'Java'},
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions = {
      cpp: 'cpp',
      java: 'java',
      python: 'py',
      javascript: 'js',
    };
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algorithm.${extensions[selectedLanguage]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#1e1e1e] border-t border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#252526] flex-shrink-0 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Code2 className="text-blue-400" size={20} />
          <h3 className="text-white font-semibold text-lg">Code Viewer</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLanguage === lang.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {lang.icon} {lang.name}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors hover:shadow-md"
              title="Copy Code"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors hover:shadow-md"
              title="Download Code"
            >
              <Download size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors hover:shadow-md"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto bg-[#1e1e1e]">
        <div className="p-6">
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <SyntaxHighlighter
              language={selectedLanguage}
              style={vscDarkPlus}
              customStyle={{
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.6',
                padding: '20px',
                margin: 0,
                backgroundColor: '#1e1e1e',
                minHeight: '200px',
              }}
              showLineNumbers
              lineNumberStyle={{
                color: '#858585',
                fontSize: '13px',
                paddingRight: '15px',
              }}
            >
              {currentCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Copy Notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-pulse z-[100] font-semibold">
          Code copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default CodeViewer;
