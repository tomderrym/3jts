import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
/**
 * Icons Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
<!DOCTYPE html>
<html lang="en">
  <head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    createElement('title', null, 'Sketch AI App Builder')
    createElement('script', {src: 'https://unpkg.com/react@18/umd/react.development.js'}, null)
    createElement('script', {src: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js'}, null)
    createElement('script', {src: 'https://unpkg.com/@babel/standalone/babel.min.js'}, null)
    createElement('script', {src: 'https://cdn.tailwindcss.com'}, null)
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kalam:wght@300;400;700&display=swap" rel="stylesheet">

createElement('style', null, 'body {
            background-color: #121212;
            color: #e0e0e0;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            touch-action: none;
        }
        .sketch-font {
            font-family: 'Kalam', cursive;
        }
        .canvas-grid {
            background-image: radial-gradient(#333 1px, transparent 1px);
            background-size: 20px 20px;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1e1e1e; }
        ::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        
        .animate-pop {
            animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes pop {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pulse-glow {
            animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.5); }
            50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.8); }
        }
        .tool-btn.active {
            background-color: #3b82f6;
            color: white;
        }
        .selection-box {
            border: 1px solid #3b82f6;
            background-color: rgba(59, 130, 246, 0.1);
            position: absolute;
            pointer-events: none;
        }')
  </head>
  <body>
<div id="app">
  createElement('div', {id: 'root'}, null)

    <script type="text/babel">
        const { useState, useEffect, useRef, useCallback } = React;

        // --- Audio Engine ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        const playSound = (type) => {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'generate') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
            } else if (type === 'success') {
                // Major triad
                [440, 554.37, 659.25].forEach((freq, i) => {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    o.connect(g);
                    g.connect(audioCtx.destination);
                    o.type = 'sine';
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0, now);
                    g.gain.linearRampToValueAtTime(0.1, now + 0.1 + (i*0.05));
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
                    o.start(now);
                    o.stop(now + 0.8);
                });
            } else if (type === 'pop') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        };

        // --- Icons (SVGs) ---
        export default function Icons = {
            Cursor: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('path', {d: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z'})createElement('path', {d: 'M13 13l6 6'})</svg>,
            Hand: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('path', {d: 'M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0'})createElement('path', {d: 'M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2'})createElement('path', {d: 'M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8'})createElement('path', {d: 'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'})</svg>,
            Pencil: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('path', {d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'})</svg>,
            Rect: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('rect', {x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2'})</svg>,
            Text: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('path', {d: 'M4 7V4h16v3'})createElement('path', {d: 'M9 20h6'})createElement('path', {d: 'M12 4v16'})</svg>,
            Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('rect', {x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2'})createElement('circle', {cx: '8.5', cy: '8.5', r: '1.5'})createElement('polyline', {points: '21 15 16 10 5 21'})</svg>,
            Magic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('path', {d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'})</svg>,
            Undo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('path', {d: 'M3 7v6h6'})createElement('path', {d: 'M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'})</svg>,
            Redo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('path', {d: 'M21 7v6h-6'})createElement('path', {d: 'M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13'})</svg>,
            Menu: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">createElement('line', {x1: '3', y1: '12', x2: '21', y2: '12'})createElement('line', {x1: '3', y1: '6', x2: '21', y2: '6'})createElement('line', {x1: '3', y1: '18', x2: '21', y2: '18'})</svg>,
        };

        // --- Helper: Generate Random ID ---
        const uid = () => Math.random().toString(36).substr(2, 9);

        // --- AI Logic Simulation ---
        const generateAIContent = (prompt, centerX, centerY) => {
            const p = prompt.toLowerCase();
            const elements = [];
            const frameId = uid();
            
            // Base Frame (Phone Screen)
            elements.push({
                id: frameId,
                type: 'rect',
                x: centerX - 150,
                y: centerY - 250,
                w: 300,
                h: 500,
                color: '#1e1e1e',
                stroke: '#444',
                strokeWidth: 2,
                isFrame: true
            });

            // Header
            elements.push({
                id: uid(),
                type: 'text',
                x: centerX - 130,
                y: centerY - 220,
                content: p.length > 20 ? 'App Screen' : prompt.charAt(0).toUpperCase() + prompt.slice(1),
                fontSize: 24,
                color: '#fff',
                parentId: frameId
            });

            if (p.includes('login') || p.includes('sign in')) {
                // Inputs
                elements.push({ id: uid(), type: 'rect', x: centerX - 120, y: centerY - 100, w: 240, h: 40, color: '#333', stroke: '#555', radius: 8, parentId: frameId });
                elements.push({ id: uid(), type: 'text', x: centerX - 110, y: centerY - 75, content: 'Email', fontSize: 14, color: '#888', parentId: frameId });
                
                elements.push({ id: uid(), type: 'rect', x: centerX - 120, y: centerY - 40, w: 240, h: 40, color: '#333', stroke: '#555', radius: 8, parentId: frameId });
                elements.push({ id: uid(), type: 'text', x: centerX - 110, y: centerY - 15, content: 'Password', fontSize: 14, color: '#888', parentId: frameId });
                
                // Button
                elements.push({ id: uid(), type: 'rect', x: centerX - 120, y: centerY + 40, w: 240, h: 45, color: '#3b82f6', stroke: 'none', radius: 8, parentId: frameId });
                elements.push({ id: uid(), type: 'text', x: centerX - 20, y: centerY + 70, content: 'Login', fontSize: 16, color: '#fff', parentId: frameId });
            } 
            else if (p.includes('gallery') || p.includes('photo') || p.includes('grid')) {
                for(let i=0; i<4; i++) {
                    const row = Math.floor(i/2);
                    const col = i%2;
                    elements.push({
                        id: uid(),
                        type: 'rect',
                        x: centerX - 120 + (col * 125),
                        y: centerY - 150 + (row * 125),
                        w: 115,
                        h: 115,
                        color: '#333',
                        stroke: '#555',
                        radius: 4,
                        parentId: frameId
                    });
                    // Placeholder icon inside
                    elements.push({
                        id: uid(),
                        type: 'text',
                        x: centerX - 80 + (col * 125),
                        y: centerY - 90 + (row * 125),
                        content: '🖼️',
                        fontSize: 30,
                        parentId: frameId
                    });
                }
            }
            else if (p.includes('music') || p.includes('player')) {
                // Album Art
                elements.push({ id: uid(), type: 'rect', x: centerX - 100, y: centerY - 150, w: 200, h: 200, color: '#333', stroke: '#555', radius: 12, parentId: frameId });
                elements.push({ id: uid(), type: 'text', x: centerX - 20, y: centerY - 50, content: '🎵', fontSize: 60, parentId: frameId });
                
                // Controls
                elements.push({ id: uid(), type: 'rect', x: centerX - 120, y: centerY + 100, w: 240, h: 4, color: '#444', parentId: frameId }); // progress
                elements.push({ id: uid(), type: 'rect', x: centerX - 120, y: centerY + 100, w: 100, h: 4, color: '#fff', parentId: frameId }); // progress fill
                
                elements.push({ id: uid(), type: 'text', x: centerX - 60, y: centerY + 160, content: '⏮️  ▶️  ⏭️', fontSize: 24, parentId: frameId });
            }
            else {
                // Generic List
                for(let i=0; i<3; i++) {
                    elements.push({ id: uid(), type: 'rect', x: centerX - 120, y: centerY - 150 + (i*70), w: 240, h: 60, color: '#2a2a2a', stroke: '#444', radius: 8, parentId: frameId });
                    elements.push({ id: uid(), type: 'rect', x: centerX - 110, y: centerY - 140 + (i*70), w: 40, h: 40, color: '#444', radius: 20, parentId: frameId });
                    elements.push({ id: uid(), type: 'rect', x: centerX - 60, y: centerY - 135 + (i*70), w: 140, h: 10, color: '#555', radius: 2, parentId: frameId });
                    elements.push({ id: uid(), type: 'rect', x: centerX - 60, y: centerY - 115 + (i*70), w: 80, h: 8, color: '#444', radius: 2, parentId: frameId });
                }
            }

            return elements;
        };

        // --- Main Component ---
        const App = () => {
            const [elements, setElements] = useState([]);
            const [tool, setTool] = useState('select'); // select, hand, rect, text, pencil
            const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
            const [prompt, setPrompt] = useState('');
            const [isGenerating, setIsGenerating] = useState(false);
            const [selectedId, setSelectedId] = useState(null);
            const [color, setColor] = useState('#3b82f6');
            
            // Interaction State
            const [isDragging, setIsDragging] = useState(false);
            const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
            const [currentShape, setCurrentShape] = useState(null);

            const canvasRef = useRef(null);

            // --- Handlers ---

            const getCanvasCoords = (e) => {
                const rect = canvasRef.current.getBoundingClientRect();
                return {
                    x: (e.clientX - rect.left - view.x) / view.zoom,
                    y: (e.clientY - rect.top - view.y) / view.zoom
                };
            };

            const handlePointerDown = (e) => {
                const coords = getCanvasCoords(e);
                playSound('click');

                if (tool === 'hand') {
                    setIsDragging(true);
                    setDragStart({ x: e.clientX, y: e.clientY });
                    return;
                }

                if (tool === 'select') {
                    // Simple hit testing (reverse to select top-most)
                    const hit = [...elements].reverse().find(el => 
                        coords.x >= el.x && coords.x <= el.x + (el.w || 0) &&
                        coords.y >= el.y && coords.y <= el.y + (el.h || 0)
                    );
                    
                    if (hit) {
                        setSelectedId(hit.id);
                        setIsDragging(true);
                        setDragStart({ x: coords.x, y: coords.y });
                    } else {
                        setSelectedId(null);
                        // Pan fallback if nothing hit
                        setIsDragging(true);
                        setDragStart({ x: e.clientX, y: e.clientY });
                        // Temporarily switch context to pan
                        // But keep tool as select
                    }
                    return;
                }

                if (tool === 'rect') {
                    const newId = uid();
                    const newShape = {
                        id: newId,
                        type: 'rect',
                        x: coords.x,
                        y: coords.y,
                        w: 0,
                        h: 0,
                        color: 'transparent',
                        stroke: color,
                        strokeWidth: 2
                    };
                    setElements(prev => [...prev, newShape]);
                    setCurrentShape(newId);
                    setIsDragging(true);
                    setDragStart({ x: coords.x, y: coords.y });
                }

                if (tool === 'pencil') {
                    const newId = uid();
                    const newPath = {
                        id: newId,
                        type: 'path',
                        points: [{ x: coords.x, y: coords.y }],
                        color: color,
                        strokeWidth: 3
                    };
                    setElements(prev => [...prev, newPath]);
                    setCurrentShape(newId);
                    setIsDragging(true);
                }
            };

            const handlePointerMove = (e) => {
                if (!isDragging) return;
                const coords = getCanvasCoords(e);

                if (tool === 'hand' || (tool === 'select' && !selectedId)) {
                    const dx = e.clientX - dragStart.x;
                    const dy = e.clientY - dragStart.y;
                    setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
                    setDragStart({ x: e.clientX, y: e.clientY });
                    return;
                }

                if (tool === 'select' && selectedId) {
                    const dx = coords.x - dragStart.x;
                    const dy = coords.y - dragStart.y;
                    
                    setElements(prev => prev.map(el => {
                        if (el.id === selectedId || el.parentId === selectedId) {
                            return { ...el, x: el.x + dx, y: el.y + dy };
                        }
                        return el;
                    }));
                    setDragStart({ x: coords.x, y: coords.y });
                    return;
                }

                if (tool === 'rect' && currentShape) {
                    setElements(prev => prev.map(el => {
                        if (el.id === currentShape) {
                            return {
                                ...el,
                                w: coords.x - el.x,
                                h: coords.y - el.y
                            };
                        }
                        return el;
                    }));
                }

                if (tool === 'pencil' && currentShape) {
                    setElements(prev => prev.map(el => {
                        if (el.id === currentShape) {
                            return {
                                ...el,
                                points: [...el.points, { x: coords.x, y: coords.y }]
                            };
                        }
                        return el;
                    }));
                }
            };

            const handlePointerUp = () => {
                setIsDragging(false);
                setCurrentShape(null);
                if (tool === 'rect' || tool === 'pencil') {
                     playSound('pop');
                }
            };

            const handleGenerate = () => {
                if (!prompt.trim()) return;
                setIsGenerating(true);
                playSound('generate');

                // Simulate AI delay
                setTimeout(() => {
                    const centerX = (-view.x + window.innerWidth/2) / view.zoom;
                    const centerY = (-view.y + window.innerHeight/2) / view.zoom;
                    
                    const newElements = generateAIContent(prompt, centerX, centerY);
                    setElements(prev => [...prev, ...newElements]);
                    setIsGenerating(false);
                    setPrompt('');
                    playSound('success');
                    setTool('select');
                }, 1500);
            };

            // File Drop Handler
            const handleDrop = (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const coords = getCanvasCoords(e);
                        const imgEl = {
                            id: uid(),
                            type: 'image',
                            src: ev.target.result,
                            x: coords.x,
                            y: coords.y,
                            w: 200,
                            h: 200 // Default size
                        };
                        setElements(prev => [...prev, imgEl]);
                        playSound('pop');
                    };
                    reader.readAsDataURL(file);
                }
            };

            // --- Render Helpers ---
            const renderElement = (el) => {
                if (el.type === 'rect') {
                    return (
                        createElement('rect', null)
                    );
                }
                if (el.type === 'text') {
                    return (
                        createElement('text', {className: 'select-none pointer-events-none', ontSize: el.fontSize || 16, ontFamily: el.isFrame ? 'Inter' : 'Kalam'}, '{el.content}')
                    );
                }
                if (el.type === 'path') {
                    const d = el.points.reduce((acc, p, i) => 
                        acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), ''
                    );
                    return (
                        createElement('path', {fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'})
                    );
                }
                if (el.type === 'image') {
                    return (
                        createElement('image', {preserveAspectRatio: 'xMidYMid slice'})
                    );
                }
                return null;
            };

            return createElement('div', {className: 'w-screen h-screen flex flex-col overflow-hidden relative'}, 'e.preventDefault()}
                    onDrop={handleDrop}
                >
                    {/* Top Bar */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#2a2a2a] p-2 rounded-lg shadow-lg border border-[#444]">
                        <button className="p-2 hover:bg-[#333] rounded text-gray-400">createElement('Icons', null)</button>
                        createElement('span', {className: 'text-sm font-medium text-gray-300 px-2'}, 'Page 1')
                        createElement('div', {className: 'h-4 w-[1px] bg-[#444] mx-1'}, null)
                        <button className="p-2 hover:bg-[#333] rounded text-gray-400" onClick={() => playSound('click')}>createElement('Icons', null)</button>
                        <button className="p-2 hover:bg-[#333] rounded text-gray-400" onClick={() => playSound('click')}>createElement('Icons', null)</button>
                    </div>

                    {/* Properties Panel (Right) */}
                    <div className="absolute top-4 right-4 z-20 bg-[#2a2a2a] p-3 rounded-lg shadow-lg border border-[#444] w-48">
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'].map(c => (
                                <button
                                    key={c}
                                    className={`w-6 h-6 rounded-full border border-gray-600 ${color === c ? 'ring-2 ring-white' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => { setColor(c); playSound('click'); }}
                                />
                            ))}
                        </div>
                        createElement('div', {className: 'text-xs text-gray-500 font-mono uppercase mb-1'}, 'Stroke')
                        createElement('input', {className: 'w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer', type: 'range', min: '1', max: '10'})
                    </div>

                    {/* Canvas */}
                    <div 
                        ref={canvasRef}
                        className="flex-1 canvas-grid cursor-crosshair relative"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        createElement('svg', {style: {{ transform: `translate(${view.x}, width: '100%', height: '100%'}, '{elements.map(renderElement)}')
                    </div>

                    {/* AI Prompt Bar */}
                    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 w-[500px] max-w-[90%]">
                        <div className={`bg-[#2a2a2a] p-1 rounded-xl shadow-2xl border border-[#444] flex items-center transition-all duration-300 ${isGenerating ? 'animate-pulse-glow border-purple-500' : ''}`}>
                            <div className="p-2 text-purple-400">
                                createElement('Icons', null)
                            </div>
                            <input 
                                type="text" 
                                placeholder="Describe your app (e.g., 'Music player', 'Login screen')..." 
                                className="bg-transparent border-none outline-none text-white flex-1 h-10 px-2 placeholder-gray-500 font-medium"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            createElement('button', {className: 'bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2', onClick: handleGenerate}, '{isGenerating ? 'Dreaming...' : 'Generate'}')
                        </div>
                        {/* Helper Text */}
                        createElement('div', {className: 'text-center mt-2 text-xs text-gray-500 font-mono opacity-60'}, 'Try: "Login screen", "Photo gallery", "Music player"')
                    </div>

                    {/* Bottom Toolbar */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 bg-[#2a2a2a] p-1.5 rounded-xl shadow-xl border border-[#444] flex gap-1">
                        {[
                            { id: 'select', icon: Icons.Cursor },
                            { id: 'hand', icon: Icons.Hand },
                            { id: 'pencil', icon: Icons.Pencil },
                            { id: 'rect', icon: Icons.Rect },
                            { id: 'text', icon: Icons.Text },
                            { id: 'image', icon: Icons.Image },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => { setTool(t.id); playSound('click'); }}
                                className={`p-3 rounded-lg transition-all ${tool === t.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}
                            >
                                createElement('t', null)
                            </button>
                        ))}
                    </div>

                    {/* Zoom Indicator */}
                    createElement('div', {className: 'absolute bottom-6 left-6 z-20 bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-[#444] text-xs font-mono text-gray-400'}, '{Math.round(view.zoom * 100)}%')

                    {/* Watermark */}
                    createElement('div', {className: 'absolute bottom-6 right-6 z-20 opacity-30 text-[10px] font-mono text-gray-500'}, 'MADE WITH SKETCH-AI')');
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(createElement('App', null));
    </script>

</div>


    createElement('script', {type: 'module', src: './index.tsx'}, null)
  </body>
</html>