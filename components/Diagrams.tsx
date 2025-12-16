/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Network, Brain, Database, Zap, ArrowRight, Share2, Layers, Search, MessageSquare, FileJson, CheckCircle } from 'lucide-react';

// --- ISSUE FRAMEWORK DIAGRAM ---
// Visualizes the Nuwa Engine process: Initiate, Structure, Socratic, Unify, Execute
export const IssueFrameworkDiagram: React.FC = () => {
    const steps = [
        { letter: 'I', name: 'Initiate', desc: 'Define Problem', icon: <Search size={16} /> },
        { letter: 'S', name: 'Structure', desc: 'Select Method', icon: <Layers size={16} /> },
        { letter: 'S', name: 'Socratic', desc: 'Refine Understanding', icon: <MessageSquare size={16} /> },
        { letter: 'U', name: 'Unify', desc: 'Integrate Plan', icon: <FileJson size={16} /> },
        { letter: 'E', name: 'Execute', desc: 'Actionable Tasks', icon: <CheckCircle size={16} /> },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center w-full p-6 bg-white border border-stone-200 rounded-sm shadow-sm">
            {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col items-center text-center group w-full md:w-32"
                    >
                        <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-nobel-gold group-hover:text-white group-hover:border-nobel-gold transition-all duration-300 mb-3 shadow-sm">
                            {step.icon}
                        </div>
                        <h4 className="font-serif font-bold text-stone-900 text-lg mb-1">{step.name}</h4>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">{step.desc}</p>
                    </motion.div>
                    {idx < steps.length - 1 && (
                        <div className="hidden md:block w-8 h-[2px] bg-stone-200"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// --- MEMORY ACTIVATION DIAGRAM ---
// Visualizes the Activation-Diffusion algorithm described in the paper
export const MemoryActivationDiagram: React.FC = () => {
  // Nodes representing Engrams
  // schema: 'raw' | 'concept'
  const [nodes, setNodes] = useState([
    { id: 0, x: 50, y: 50, label: 'Query: "Orders Slow"', type: 'query', active: 0 },
    { id: 1, x: 30, y: 30, label: 'Latency', type: 'concept', active: 0 },
    { id: 2, x: 70, y: 30, label: 'DB Index', type: 'concept', active: 0 },
    { id: 3, x: 20, y: 60, label: 'Timeout Error', type: 'raw', active: 0 },
    { id: 4, x: 80, y: 60, label: 'Index Optimization', type: 'raw', active: 0 },
    { id: 5, x: 50, y: 80, label: 'Optimization Plan', type: 'concept', active: 0 },
  ]);

  // Edges: source -> target
  const edges = [
    { s: 0, t: 1 }, { s: 0, t: 2 }, // Query triggers concepts
    { s: 1, t: 3 }, // Latency -> Timeout
    { s: 2, t: 4 }, // DB Index -> Optimization
    { s: 4, t: 5 }, // Optimization -> Plan
    { s: 2, t: 1 }, // Cross concept connection
  ];

  const activateNode = (id: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, active: 1 } : n));
  };

  // Simulation of "Diffusion"
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => {
        const newNodes = [...prev];
        let changed = false;

        // Decay existing activation
        newNodes.forEach(n => {
          if (n.active > 0) {
            n.active = Math.max(0, n.active - 0.05);
            changed = true;
          }
        });

        // Spread activation to neighbors
        edges.forEach(edge => {
          const source = prev.find(n => n.id === edge.s);
          const targetIndex = newNodes.findIndex(n => n.id === edge.t);
          
          if (source && source.active > 0.2 && targetIndex !== -1) {
             const transfer = source.active * 0.1; // Diffusion rate
             if (newNodes[targetIndex].active < source.active) {
                newNodes[targetIndex].active = Math.min(1, newNodes[targetIndex].active + transfer);
                changed = true;
             }
          }
        });

        return changed ? newNodes : prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-sm shadow-sm border border-stone-200 my-8">
      <div className="flex items-center gap-2 mb-4">
        <Network className="text-nobel-gold" />
        <h3 className="font-serif text-xl text-stone-900">Engram Activation-Diffusion</h3>
      </div>
      <p className="text-sm text-stone-500 mb-6 text-center max-w-md">
        Click the <strong>Query Node</strong> to trigger spreading activation. The system recalls 3-day old "Index Optimization" memories based on conceptual links, not just keywords.
      </p>
      
      <div className="relative w-full max-w-md h-80 bg-[#FAFAF9] rounded-sm border border-stone-200 overflow-hidden">
         <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((e, i) => {
                const s = nodes.find(n => n.id === e.s);
                const t = nodes.find(n => n.id === e.t);
                if (!s || !t) return null;
                const activeLink = s.active > 0.1 || t.active > 0.1;
                return (
                    <line 
                        key={i} 
                        x1={`${s.x}%`} y1={`${s.y}%`} 
                        x2={`${t.x}%`} y2={`${t.y}%`} 
                        stroke={activeLink ? "#C5A059" : "#cbd5e1"} 
                        strokeWidth={activeLink ? 2 : 1}
                        strokeOpacity={activeLink ? 0.8 : 0.4}
                    />
                );
            })}
         </svg>

         {nodes.map(node => (
             <motion.button
                key={node.id}
                onClick={() => activateNode(node.id)}
                className={`absolute w-24 h-24 -ml-12 -mt-12 flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10 hover:scale-105`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
             >
                <div 
                    className={`w-4 h-4 rounded-full mb-1 transition-all duration-200 ${node.type === 'query' ? 'ring-2 ring-offset-2 ring-nobel-gold' : ''}`}
                    style={{ 
                        backgroundColor: node.active > 0.1 ? `rgba(197, 160, 89, ${Math.max(0.3, node.active)})` : (node.type === 'query' ? '#1c1917' : '#d6d3d1'),
                        boxShadow: node.active > 0.3 ? `0 0 15px rgba(197, 160, 89, ${node.active})` : 'none'
                    }}
                ></div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-sm bg-white/90 backdrop-blur-sm border ${node.active > 0.1 ? 'text-nobel-gold border-nobel-gold/50' : 'text-stone-500 border-stone-200'}`}>
                    {node.label}
                </span>
             </motion.button>
         ))}
      </div>
      
      <div className="mt-4 flex gap-4 text-xs font-mono text-stone-500">
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-stone-900"></div> Query</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-stone-300"></div> Dormant Engram</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-nobel-gold"></div> Activated Memory</div>
      </div>
    </div>
  );
};

// --- ARCHITECTURE FLOW ---
export const ArchitectureDiagram: React.FC = () => {
    return (
        <div className="p-8 bg-stone-900 text-stone-100 rounded-sm border border-stone-800 my-8">
            <h3 className="font-serif text-xl mb-6 text-center text-nobel-gold">System Architecture</h3>
            
            <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center h-full">
                {/* Service Layer */}
                <div className="flex-1 bg-stone-800/50 rounded-sm p-4 border border-stone-700 flex flex-col items-center gap-3">
                    <div className="p-2 bg-stone-700 rounded-sm"><Share2 size={20} className="text-stone-400" /></div>
                    <h4 className="font-bold text-sm tracking-widest text-stone-400">SERVICE LAYER</h4>
                    <div className="w-full text-xs text-center space-y-2 mt-2">
                        <div className="bg-stone-900 py-2 rounded-sm border border-stone-600">MCP Server</div>
                        <div className="bg-stone-900 py-2 rounded-sm border border-stone-600">Protocol Resolver</div>
                        <div className="bg-stone-900 py-2 rounded-sm border border-stone-600">API Clients</div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col justify-center text-stone-600"><ArrowRight /></div>

                {/* Cognitive Engine */}
                <div className="flex-1 bg-stone-800/50 rounded-sm p-4 border border-stone-700 border-t-4 border-t-nobel-gold flex flex-col items-center gap-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-nobel-gold/5 pointer-events-none"></div>
                    <div className="p-2 bg-stone-700 rounded-sm"><Brain size={20} className="text-nobel-gold" /></div>
                    <h4 className="font-bold text-sm tracking-widest text-nobel-gold">COGNITIVE ENGINE</h4>
                    <div className="w-full text-xs text-center space-y-2 mt-2 z-10">
                        <div className="bg-stone-900 py-2 rounded-sm border border-nobel-gold/30 text-white font-medium">Nuwa (Role Engine)</div>
                        <div className="bg-stone-900 py-2 rounded-sm border border-nobel-gold/30 text-white font-medium">Luban (Tool Engine)</div>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-stone-900 py-1 rounded-sm border border-stone-600 text-[10px]">Memory Context</div>
                            <div className="flex-1 bg-stone-900 py-1 rounded-sm border border-stone-600 text-[10px]">PML Repo</div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col justify-center text-stone-600"><ArrowRight /></div>

                {/* Memory Layer */}
                <div className="flex-1 bg-stone-800/50 rounded-sm p-4 border border-stone-700 flex flex-col items-center gap-3">
                     <div className="p-2 bg-stone-700 rounded-sm"><Database size={20} className="text-stone-400" /></div>
                     <h4 className="font-bold text-sm tracking-widest text-stone-400">MEMORY LAYER</h4>
                     <div className="w-full text-xs text-center space-y-2 mt-2">
                        <div className="bg-stone-900 py-2 rounded-sm border border-stone-600">Graph Network</div>
                        <div className="bg-stone-900 py-2 rounded-sm border border-stone-600">Engram DB</div>
                        <div className="bg-stone-900 py-2 rounded-sm border border-stone-600">Sandbox</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ value, duration = 2, suffix = '' }: { value: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20px" });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const increment = end / (duration * 60);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, 1000 / 60);
            return () => clearInterval(timer);
        }
    }, [isInView, value, duration]);

    return <span ref={ref}>{Math.floor(count).toLocaleString()}{suffix}</span>;
}

// --- IMPACT METRICS ---
export const ImpactMetrics: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm flex flex-col items-center text-center group"
            >
                <div className="w-12 h-12 bg-stone-50 text-stone-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-nobel-gold group-hover:text-white transition-colors duration-300">
                    <Share2 size={24} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-1">
                    <AnimatedCounter value={50000} suffix="+" />
                </h3>
                <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Downloads</p>
                <p className="text-stone-400 text-xs mt-2">Across 15+ enterprises</p>
            </motion.div>

            <motion.div 
                 whileHover={{ y: -5 }}
                 className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm flex flex-col items-center text-center group"
            >
                <div className="w-12 h-12 bg-stone-50 text-stone-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-nobel-gold group-hover:text-white transition-colors duration-300">
                    <Zap size={24} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-1">
                    <AnimatedCounter value={2} suffix="x" duration={1} />
                </h3>
                <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Revenue Growth</p>
                <p className="text-stone-400 text-xs mt-2">Reported in Tourism Case</p>
            </motion.div>

             <motion.div 
                 whileHover={{ y: -5 }}
                 className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm flex flex-col items-center text-center group"
            >
                <div className="w-12 h-12 bg-stone-50 text-stone-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-nobel-gold group-hover:text-white transition-colors duration-300">
                    <Layers size={24} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-1">
                    -<AnimatedCounter value={30} suffix="%" duration={1.5} />
                </h3>
                <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Operational Cost</p>
                <p className="text-stone-400 text-xs mt-2">Via Automated Agents</p>
            </motion.div>
        </div>
    )
}