import React, { useState, useRef } from 'react';
import { Play, RotateCcw, Trash2, ArrowLeft, Terminal, Keyboard, Cpu, CheckCircle2, AlertCircle, Settings, X, Globe, Server, Cloud, FileCode, Plus, Upload, Code, Folder, File, ChevronRight, ChevronDown, Trash, Edit2, FolderPlus, FilePlus, ChevronsLeft, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const LANGUAGE_ICONS = {
  c:          '🔵',
  cpp:        '🟣',
  java:       '☕',
  javascript: '🟡',
  python:     '🐍',
};

// Wandbox compiler IDs — confirmed from https://wandbox.org/api/list.json
const WANDBOX_COMPILERS = {
  c:          'gcc-13.2.0-c',
  cpp:        'gcc-13.2.0',
  java:       'openjdk-jdk-21+35',
  javascript: 'nodejs-20.2.0',
  python:     'cpython-3.12.0',
};

const LANGUAGES = {
  c: {
    name: 'C',
    codexLang: 'c',
    monacoLang: 'c',
    fileName: 'main.c',
    template: `#include <stdio.h>

int main() {
    printf("Welcome to the Playground!\\n");
    return 0;
}`
  },
  cpp: {
    name: 'C++',
    codexLang: 'cpp',
    monacoLang: 'cpp',
    fileName: 'main.cpp',
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to the Playground!" << endl;
    return 0;
}`
  },
  java: {
    name: 'Java',
    codexLang: 'java',
    monacoLang: 'java',
    fileName: 'Main.java',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to the Playground!");
    }
}`
  },
  javascript: {
    name: 'JavaScript',
    codexLang: 'js',
    monacoLang: 'javascript',
    fileName: 'main.js',
    template: `console.log("Welcome to the Playground!");
`
  },
  python: {
    name: 'Python',
    codexLang: 'py',
    monacoLang: 'python',
    fileName: 'main.py',
    template: `print("Welcome to the Playground!")
`
  },
};

const PlaygroundPage = () => {
  const { isDark } = useTheme();
  const [selectedLang, setSelectedLang] = useState('cpp');
  
  // Virtual File System State
  const [fileSystem, setFileSystem] = useState([
    { path: LANGUAGES.cpp.fileName, content: LANGUAGES.cpp.template, type: 'file' }
  ]);
  const [activeFilePath, setActiveFilePath] = useState(LANGUAGES.cpp.fileName);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'input'
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runStats, setRunStats] = useState(null);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [executionEngine, setExecutionEngine] = useState(() => {
    return localStorage.getItem('playground-engine') || 'wandbox'; // 'wandbox' | 'codex' | 'piston'
  });
  const [pistonEndpoint, setPistonEndpoint] = useState(() => {
    return localStorage.getItem('playground-piston-endpoint') || 'http://localhost:2000/api/v2/execute';
  });
  const [pistonToken, setPistonToken] = useState(() => {
    return localStorage.getItem('playground-piston-token') || '';
  });
  const [jsExecutionMode, setJsExecutionMode] = useState(() => {
    return localStorage.getItem('playground-js-mode') || 'browser'; // 'browser' (default) or 'server'
  });

  // Pyodide runtime cache (loaded once, reused)
  const pyodideRef = useRef(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);

  // VFS Helpers
  const activeCode = fileSystem.find(f => f.path === activeFilePath)?.content || '';
  
  const setCode = (newContent) => {
    setFileSystem(prev => prev.map(f => f.path === activeFilePath ? { ...f, content: newContent } : f));
  };

  const createItem = (type) => {
    const name = window.prompt(`Enter ${type} name (e.g., utils or utils/math.cpp):`);
    if (!name) return;
    
    // Simple validation
    if (fileSystem.some(f => f.path === name)) {
      alert('A file or folder with this path already exists.');
      return;
    }

    if (type === 'folder') {
      setFileSystem(prev => [...prev, { path: name, type: 'folder' }]);
    } else {
      setFileSystem(prev => [...prev, { path: name, content: '', type: 'file' }]);
      setActiveFilePath(name);
    }
  };

  const deleteItem = (path) => {
    if (path === LANGUAGES[selectedLang].fileName) {
      alert('Cannot delete the main entry file.');
      return;
    }
    if (window.confirm(`Delete ${path}? This will also delete all files inside if it's a folder.`)) {
      setFileSystem(prev => prev.filter(f => !f.path.startsWith(path)));
      if (activeFilePath.startsWith(path)) {
        setActiveFilePath(LANGUAGES[selectedLang].fileName);
      }
    }
  };

  // Sync templates on language change
  const handleLanguageChange = (langKey) => {
    if (window.confirm(`Switching to ${LANGUAGES[langKey].name} will reset the workspace. Continue?`)) {
      setSelectedLang(langKey);
      setFileSystem([
        { path: LANGUAGES[langKey].fileName, content: LANGUAGES[langKey].template, type: 'file' }
      ]);
      setActiveFilePath(LANGUAGES[langKey].fileName);
      setError('');
      setOutput('');
      setRunStats(null);
    }
  };

  // Reset template
  const handleReset = () => {
    if (window.confirm(`Are you sure you want to reset the workspace to default? All custom files will be lost.`)) {
      setFileSystem([
        { path: LANGUAGES[selectedLang].fileName, content: LANGUAGES[selectedLang].template, type: 'file' }
      ]);
      setActiveFilePath(LANGUAGES[selectedLang].fileName);
    }
  };

  // Clear console/input
  const handleClear = () => {
    setCustomInput('');
    setOutput('');
    setError('');
    setRunStats(null);
  };

  // Save Settings
  const saveSettings = () => {
    localStorage.setItem('playground-engine', executionEngine);
    localStorage.setItem('playground-piston-endpoint', pistonEndpoint);
    localStorage.setItem('playground-piston-token', pistonToken);
    localStorage.setItem('playground-js-mode', jsExecutionMode);
    setShowSettings(false);
  };

  // Reset Settings to Default
  const resetSettings = () => {
    setExecutionEngine('wandbox');
    setPistonEndpoint('http://localhost:2000/api/v2/execute');
    setPistonToken('');
    setJsExecutionMode('browser');
  };

  // Evaluate JavaScript browser-side
  const runJSInBrowser = () => {
    const logs = [];
    const errors = [];
    
    // Backup original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      originalLog.apply(console, args);
    };
    console.error = (...args) => {
      errors.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      originalError.apply(console, args);
    };
    console.warn = (...args) => {
      logs.push('[WARN] ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      originalWarn.apply(console, args);
    };
    console.info = (...args) => {
      logs.push('[INFO] ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      originalInfo.apply(console, args);
    };

    const startTime = performance.now();
    try {
      // Execute the user's code using Function Constructor
      const runFn = new Function(activeCode);
      runFn();
      
      const endTime = performance.now();
      setOutput(logs.join('\n'));
      if (errors.length > 0) {
        setError(errors.join('\n'));
      }
      setRunStats({
        success: errors.length === 0,
        stage: 'Browser Execution',
        timeMs: Math.round(endTime - startTime),
        version: 'V8 (Local Browser)'
      });
    } catch (err) {
      setError(err.stack || err.message || 'Runtime Error');
      setRunStats({
        success: false,
        stage: 'Browser Execution Runtime',
        version: 'V8 (Local Browser)'
      });
    } finally {
      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    }
  };

  // Evaluate Python browser-side using Pyodide (WebAssembly) — 100% offline
  const runPythonInBrowser = async () => {
    const startTime = performance.now();
    try {
      // Load Pyodide once and cache it in a ref
      if (!pyodideRef.current) {
        setIsPyodideLoading(true);

        // Dynamically inject Pyodide CDN script if not already loaded
        if (!window.loadPyodide) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        });
        pyodideRef.current = pyodide;
        setIsPyodideLoading(false);
        setOutput('Executing...');
      }

      // Show executing message before running user code
      setOutput('Executing...');

      const pyodide = pyodideRef.current;

      // Setup stdout/stderr capture and stdin simulation
      const setupCode = `
import sys, builtins
from io import StringIO
_stdout_buf = StringIO()
_stderr_buf = StringIO()
sys.stdout = _stdout_buf
sys.stderr = _stderr_buf
_input_lines = ${JSON.stringify(customInput ? customInput.split('\n') : [])}
_input_idx = [0]
def _mock_input(prompt=''):
    if prompt:
        _stdout_buf.write(prompt)
    if _input_idx[0] < len(_input_lines):
        line = _input_lines[_input_idx[0]]
        _input_idx[0] += 1
        return line
    raise EOFError('No more input')
builtins.input = _mock_input
`;
      await pyodide.runPythonAsync(setupCode);

      // Run the user's code
      try {
        await pyodide.runPythonAsync(activeCode);
      } catch (pyErr) {
        const stderr = await pyodide.runPythonAsync('_stderr_buf.getvalue()');
        setError(stderr || pyErr.message);
        setRunStats({ success: false, stage: 'Runtime Error', version: 'Pyodide (Browser)' });
        return;
      }

      const stdout = await pyodide.runPythonAsync('_stdout_buf.getvalue()');
      const stderr = await pyodide.runPythonAsync('_stderr_buf.getvalue()');
      const endTime = performance.now();

      setOutput(stdout);
      if (stderr) setError(stderr);
      setRunStats({
        success: !stderr,
        stage: 'Execution',
        timeMs: Math.round(endTime - startTime),
        version: 'Pyodide 0.25 (Browser)',
      });
    } catch (err) {
      setIsPyodideLoading(false);
      setError(`Failed to initialize Python runtime:\n${err.message}`);
      setRunStats({ success: false, stage: 'Runtime Load Error', version: 'Pyodide' });
    }
  };

  // Run code on Wandbox — primary free cloud engine (no auth, supports stdin)
  const runOnWandbox = async () => {
    const compiler = WANDBOX_COMPILERS[selectedLang];
    if (!compiler) {
      setError('No Wandbox compiler found for this language.');
      return;
    }

    const secondaryCodes = [];
    let primaryCode = '';

    // Use the ACTIVE file as the entry point, not necessarily the language default file.
    // All other files are compiled alongside it as secondary units.
    fileSystem.forEach(f => {
      if (f.type !== 'file') return;
      if (f.path === activeFilePath) {
        primaryCode = f.content;
      } else {
        secondaryCodes.push({ file: f.path, code: f.content });
      }
    });

    // Special Wandbox wrapper for Java to support `public class Main` in Main.java
    if (selectedLang === 'java') {
      secondaryCodes.push({ file: LANGUAGES['java'].fileName, code: primaryCode });
      primaryCode = 'class prog { public static void main(String[] args) { try { Main.main(args); } catch (Exception e) { e.printStackTrace(); } } }';
    }

    try {
      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler,
          code: primaryCode,
          codes: secondaryCodes,
          stdin: customInput,
          'compiler-option-raw': '',
          'runtime-option-raw': '',
          save: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Wandbox returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const stdout = data.program_output || '';
      const stderr = data.program_error || '';
      const compileErr = data.compiler_error || '';
      const exitCode = data.status !== undefined ? parseInt(data.status, 10) : 0;

      if (compileErr) {
        setError(compileErr);
        setRunStats({ success: false, stage: 'Compilation', version: 'Wandbox / gcc' });
        return;
      }

      setOutput(stdout);
      if (stderr) setError(stderr);
      setRunStats({
        success: exitCode === 0,
        stage: 'Execution',
        version: `Wandbox / ${compiler}`,
      });
    } catch (err) {
      // Wandbox failed — fall back to CodeX
      await runOnCodeX(true);
    }
  };

  // CodeX API — fallback cloud engine
  const runOnCodeX = async (isFallback = false) => {
    const langConfig = LANGUAGES[selectedLang];
    const label = isFallback ? 'CodeX (fallback)' : 'CodeX Cloud';

    try {
      const response = await fetch('https://api.codex.jaagrav.in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: activeCode,
          language: langConfig.codexLang,
          input: customInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`CodeX returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.output !== undefined || data.error !== undefined) {
        // CodeX v2-style response
        const out = data.output || '';
        const err = data.error || '';
        setOutput(out);
        if (err) setError(err);
        setRunStats({ success: !err, stage: 'Execution', version: label });
      } else if (data.success) {
        setOutput(data.data || '');
        if (data.error) setError(data.error);
        setRunStats({ success: !data.error, stage: 'Execution', version: label });
      } else {
        throw new Error(data.error || 'Execution returned no result');
      }
    } catch (err) {
      // Auto-fallback to browser for JS and Python
      if (selectedLang === 'javascript') {
        runJSInBrowser();
        return;
      }
      if (selectedLang === 'python') {
        await runPythonInBrowser();
        return;
      }
      setError(
        `All cloud engines are currently unavailable.\n\n` +
        `Tried: Wandbox → CodeX\n` +
        `Last error: ${err.message}`
      );
      setRunStats({ success: false, stage: 'Cloud Error', version: isFallback ? 'Wandbox+CodeX' : 'CodeX' });
    }
  };

  // Run code using custom self-hosted Piston server
  const runOnPiston = async () => {
    const langConfig = LANGUAGES[selectedLang];
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (pistonToken.trim()) {
        headers['Authorization'] = `Bearer ${pistonToken.trim()}`;
      }

      const response = await fetch(pistonEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: LANGUAGES[selectedLang].codexLang,
          version: '*',
          files: fileSystem.filter(f => f.type === 'file').map(f => ({
            name: f.path,
            content: f.content
          })),
          stdin: customInput
        })
      });

      if (response.status === 401) {
        setError(
          `Unauthorized (401):\n` +
          `The execution server at "${pistonEndpoint}" requires authentication.\n\n` +
          `Please provide a valid token in the settings panel.`
        );
        setRunStats({
          success: false,
          stage: 'Authentication Error',
          code: 401
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`Execution server returned status code ${response.status}`);
      }

      const data = await response.json();

      // Check compile errors first
      if (data.compile && data.compile.code !== 0) {
        setError(data.compile.stderr || data.compile.output || 'Compilation failed');
        setRunStats({
          success: false,
          stage: 'Compilation',
          code: data.compile.code
        });
        return;
      }

      // Check run results
      const runResult = data.run;
      if (runResult) {
        if (runResult.stderr) {
          setError(runResult.stderr);
        }
        setOutput(runResult.stdout || '');
        setRunStats({
          success: runResult.code === 0,
          stage: 'Execution',
          code: runResult.code,
          signal: runResult.signal,
          version: data.version
        });
      } else {
        setError('No execution result returned from standard runner.');
      }
    } catch (err) {
      setError(
        `Connection Error:\n` +
        `Failed to reach code execution server at: "${pistonEndpoint}"\n\n` +
        `Details: ${err.message}`
      );
    }
  };

  // Main runner router
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    setRunStats(null);

    // JavaScript: always run in browser by default (100% offline)
    if (selectedLang === 'javascript' && jsExecutionMode !== 'server') {
      setTimeout(() => {
        runJSInBrowser();
        setIsRunning(false);
      }, 50);
      return;
    }

    // Python: run via Pyodide (WASM) in the browser by default
    if (selectedLang === 'python') {
      await runPythonInBrowser();
      setIsRunning(false);
      return;
    }

    if (executionEngine === 'wandbox' || executionEngine === 'codex') {
      if (executionEngine === 'wandbox') {
        await runOnWandbox();
      } else {
        await runOnCodeX();
      }
    } else {
      await runOnPiston();
    }
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex flex-col p-4 md:p-6 max-w-[1600px] w-full mx-auto gap-4">
        {/* Navigation & Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <Link to="/algorithms" className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shadow-sm bg-white dark:bg-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Playground</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Write, run, and test your code in multiple languages</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative">
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg pl-4 pr-10 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {Object.keys(LANGUAGES).map((key) => (
                  <option key={key} value={key}>
                    {LANGUAGES[key].name} {WANDBOX_COMPILERS[key] ? `(${WANDBOX_COMPILERS[key]})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white shadow-sm transition-all ml-2 ${
                isRunning
                  ? 'bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed opacity-80'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : 'fill-current'}`} />
              {isRunning ? 'Running...' : 'Run'}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors shadow-sm ml-1"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Reset
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
              Clear
            </button>

            {/* Settings (Subtle) */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors shadow-sm ml-2"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workspace Layout - 3 Columns */}
        <div className="flex-1 flex gap-4 min-h-[600px]">
          
          {/* Left Column: Files Sidebar */}
          <div className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
            isSidebarOpen ? 'w-52 min-w-[13rem]' : 'w-10 min-w-[2.5rem]'
          }`}>
            {isSidebarOpen ? (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">FILES</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button onClick={() => createItem('file')} className="p-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="New File"><FilePlus className="w-3.5 h-3.5" /></button>
                    <button onClick={() => createItem('folder')} className="p-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="New Folder"><FolderPlus className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Hide Files">
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-2 overflow-y-auto">
                  {[...fileSystem].sort((a, b) => a.path.localeCompare(b.path)).map((item) => {
                    const parts = item.path.split('/');
                    const depth = parts.length - 1;
                    const name = parts[parts.length - 1];
                    const isFolder = item.type === 'folder';
                    const isActive = item.path === activeFilePath;
                    const isMain = item.path === LANGUAGES[selectedLang].fileName;

                    return (
                      <div
                        key={item.path}
                        onClick={() => { if (!isFolder) setActiveFilePath(item.path); }}
                        className={`flex items-center justify-between px-3 py-1.5 mb-1 rounded-lg border cursor-pointer transition-colors ${
                          isActive && !isFolder
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800/50'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isFolder ? <Folder className="w-4 h-4 text-slate-400 shrink-0" /> : <FileCode className="w-4 h-4 shrink-0" />}
                          <span className="text-sm font-semibold truncate" title={item.path}>{name}</span>
                        </div>
                        <div className={`flex items-center gap-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                          {!isMain && (
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteItem(item.path); }}
                              className="p-1 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {isActive && !isFolder && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 ml-2"></div>}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Collapsed sidebar — show only a toggle button */
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex flex-col items-center justify-start gap-2 w-full h-full pt-3 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                title="Show Files"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>FILES</span>
              </button>
            )}
          </div>

          {/* Middle Column: Editor */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex items-center px-0 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 border-t-2 border-t-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-200">
                {activeFilePath.split('/').pop()}
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 relative w-full overflow-hidden bg-white dark:bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={LANGUAGES[selectedLang].monacoLang}
                theme={isDark ? 'vs-dark' : 'light'}
                value={activeCode}
                onChange={(val) => setCode(val || '')}
                loading={
                  <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#1e1e1e]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-slate-500">Loading Editor...</span>
                    </div>
                  </div>
                }
                options={{
                  fontSize: 14,
                  fontFamily: 'Fira Code, Menlo, Monaco, Consolas, Courier New, monospace',
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  cursorBlinking: 'smooth',
                  formatOnPaste: true,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>
            
            {/* Editor Status Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <button title="Shortcuts"><Keyboard className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-4">
                <span>Ln {activeCode.split('\n').length}, Col {activeCode.length > 0 ? activeCode.length - activeCode.lastIndexOf('\n') : 1}</span>
                <span>Spaces: 4</span>
                <span>UTF-8</span>
                <span>{LANGUAGES[selectedLang].name} {WANDBOX_COMPILERS[selectedLang] ? `(${WANDBOX_COMPILERS[selectedLang]})` : ''}</span>
                <span className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></div>
                  {isRunning ? 'Running' : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Input & Output Pane */}
          <div className="flex flex-col gap-4 w-[340px] min-w-[280px]">
            
            {/* Input Window */}
            <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex-1 min-h-[150px]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Custom Input (stdin)</span>
                {selectedLang === 'javascript' && jsExecutionMode === 'browser' && (
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded ml-auto">Not supported locally</span>
                )}
              </div>
              <textarea
                value={customInput}
                disabled={selectedLang === 'javascript' && jsExecutionMode === 'browser'}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={
                  selectedLang === 'javascript' && jsExecutionMode === 'browser'
                    ? "Local JavaScript execution runs immediately in browser memory and does not accept stdin streams."
                    : "Input for the program (optional)"
                }
                className="flex-1 w-full bg-transparent px-4 py-3 text-sm font-mono outline-none resize-none placeholder:text-slate-400/60 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200 disabled:cursor-not-allowed"
              />
            </div>

            {/* Output Window */}
            <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex-[1.5] min-h-[250px]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="font-mono font-bold text-slate-400">{'>_'}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Output</span>
                </div>
                <div className="flex items-center gap-2">
                  {runStats && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${runStats.success ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'text-rose-600 bg-rose-50 dark:bg-rose-950/30'}`}>
                      {runStats.success ? 'Success' : `Error (${runStats.stage})`}
                    </span>
                  )}
                  {runStats && runStats.timeMs !== undefined && (
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                      {runStats.timeMs}ms
                    </span>
                  )}
                  <button onClick={() => { setOutput(''); setError(''); }} className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 ml-2 transition-colors border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-white dark:bg-slate-900 p-4 font-mono text-sm overflow-auto text-slate-700 dark:text-slate-300 select-text select-all">
                {isRunning && (
                  <div className="flex items-center gap-2 text-indigo-500 py-1">
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Executing...</span>
                  </div>
                )}

                {!isRunning && !output && !error && (
                  <span className="text-slate-400 italic">Program output will appear here...</span>
                )}

                {error && (
                  <div className="text-rose-500 font-medium whitespace-pre-wrap mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    {error}
                  </div>
                )}

                {output && (
                  <pre className="whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-200">{output}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Playground Settings</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5">
              {/* Execution Engine Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Compilation & Execution Engine
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setExecutionEngine('wandbox')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      executionEngine === 'wandbox'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Wandbox ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setExecutionEngine('codex')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      executionEngine === 'codex'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    CodeX
                  </button>
                  <button
                    type="button"
                    onClick={() => setExecutionEngine('piston')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      executionEngine === 'piston'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Piston
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  <strong className="text-slate-300">Wandbox</strong> (recommended) — free, no auth, supports all 5 languages + stdin.
                  <strong className="text-slate-300"> CodeX</strong> — fallback cloud. <strong className="text-slate-300">Piston</strong> — self-hosted Docker.
                </p>
              </div>

              {/* JS Mode Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  JavaScript Execution Mode
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setJsExecutionMode('browser')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      jsExecutionMode === 'browser'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Local Browser (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setJsExecutionMode('server')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      jsExecutionMode === 'server'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Remote Engine
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Local browser runs immediately inside the browser memory. Remote engine executes on the selected compiler engine above.
                </p>
              </div>

              {/* Piston Settings (Only if piston engine is selected) */}
              {executionEngine === 'piston' && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-150">
                  {/* Endpoint URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Piston API Endpoint
                    </label>
                    <input
                      type="text"
                      value={pistonEndpoint}
                      onChange={(e) => setPistonEndpoint(e.target.value)}
                      placeholder="http://localhost:2000/api/v2/execute"
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Start your self-hosted server using Docker Compose to handle requests at this local address.
                    </p>
                  </div>

                  {/* API Token */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Authorization Token (Optional)
                    </label>
                    <input
                      type="password"
                      value={pistonToken}
                      onChange={(e) => setPistonToken(e.target.value)}
                      placeholder="Bearer or access token"
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <button
                type="button"
                onClick={resetSettings}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
              >
                Reset to Default
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveSettings}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaygroundPage;
