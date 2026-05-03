"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [radius, setRadius] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setRadius(w < 480 ? 120 : w < 768 ? 150 : w < 1024 ? 170 : 200);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulseEffect[relId] = true; });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "text-violet-700 bg-violet-100 border-violet-300";
      case "in-progress": return "text-emerald-700 bg-emerald-50 border-emerald-300";
      case "pending": return "text-gray-500 bg-gray-100 border-gray-300";
      default: return "text-gray-500 bg-gray-100 border-gray-300";
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Centre orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-violet-300/40 animate-ping opacity-70"></div>
            <div className="absolute w-24 h-24 rounded-full border border-violet-200/30 animate-ping opacity-50" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-lg"></div>
          </div>

          {/* Orbit ring — matches dynamic radius */}
          <div
            className="absolute rounded-full border border-violet-300/50"
            style={{ width: radius * 2, height: radius * 2 }}
          />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Energy halo */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(124,58,237,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                {/* Node icon */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isExpanded ? "bg-violet-600 text-white scale-150" : isRelated ? "bg-violet-100 text-violet-700" : "bg-white text-violet-600"}
                  border-2
                  ${isExpanded ? "border-violet-500 shadow-lg shadow-violet-500/40" : isRelated ? "border-violet-400 animate-pulse" : "border-violet-200"}
                  transition-all duration-300 transform shadow-sm
                `}>
                  <Icon size={16} />
                </div>

                {/* Label */}
                <div className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${isExpanded ? "text-violet-700 scale-125" : "text-gray-500"}`}
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-white border-violet-200 shadow-xl shadow-violet-200/40 overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-violet-300"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "DELIVERED" : item.status === "in-progress" ? "ACTIVE" : "AVAILABLE"}
                        </Badge>
                        <span className="text-xs font-mono text-gray-400">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-gray-900">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-600">
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3 border-t border-violet-100">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center gap-1 text-gray-500"><Zap size={10} />Impact</span>
                          <span className="font-mono text-violet-600">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-violet-50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400" style={{ width: `${item.energy}%` }}></div>
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-violet-100">
                          <div className="flex items-center mb-2 gap-1">
                            <Link size={10} className="text-gray-400" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-gray-400">Related Services</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-md border-violet-200 bg-transparent hover:bg-violet-50 text-gray-600 hover:text-violet-700 transition-all cursor-pointer"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-violet-400" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
