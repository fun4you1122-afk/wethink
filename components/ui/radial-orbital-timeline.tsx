"use client";
import { useState, useEffect, useRef, useCallback } from "react";
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

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

  // Refs — mutated directly so animation never triggers React re-renders
  const rotationRef    = useRef(0);
  const radiusRef      = useRef(200);
  const autoRotateRef  = useRef(true);
  const rafRef         = useRef(0);
  const containerRef   = useRef<HTMLDivElement>(null);
  const orbitRef       = useRef<HTMLDivElement>(null);
  const nodeRefs       = useRef<Record<number, HTMLDivElement | null>>({});

  // radiusState drives the ring div so it re-renders when radius changes
  const [radiusState, setRadiusState] = useState(200);

  // Keep autoRotateRef in sync with React state
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);

  // Responsive radius — write to ref (for rAF) AND state (for ring div)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const r = w < 480 ? 110 : w < 768 ? 140 : w < 1024 ? 170 : 200;
      radiusRef.current = r;
      setRadiusState(r);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Direct DOM mutation — positions nodes without React re-renders
  const applyPositions = useCallback((rotation: number) => {
    const total  = timelineData.length;
    const radius = radiusRef.current;

    timelineData.forEach((item, index) => {
      const el = nodeRefs.current[item.id];
      if (!el) return;

      const angle   = ((index / total) * 360 + rotation) % 360;
      const radian  = (angle * Math.PI) / 180;
      const x       = radius * Math.cos(radian);
      const y       = radius * Math.sin(radian);
      const zIndex  = Math.round(100 + 50 * Math.cos(radian));
      const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

      // translateZ(0) forces GPU layer on iOS — eliminates jank
      el.style.transform = `translate(${x}px, ${y}px) translateZ(0)`;
      el.style.opacity   = String(opacity);
      el.style.zIndex    = String(zIndex);
    });
  }, [timelineData]);

  // rAF loop — synced to display refresh rate, no setState
  useEffect(() => {
    const tick = () => {
      if (autoRotateRef.current) {
        rotationRef.current = (rotationRef.current + 0.25) % 360;
        applyPositions(rotationRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyPositions]);

  const getRelatedItems = (itemId: number) =>
    timelineData.find((i) => i.id === itemId)?.relatedIds ?? [];

  const isRelatedToActive = (itemId: number) =>
    activeNodeId ? getRelatedItems(activeNodeId).includes(itemId) : false;

  const centerOnNode = (nodeId: number) => {
    const idx = timelineData.findIndex((i) => i.id === nodeId);
    const target = 270 - (idx / timelineData.length) * 360;
    rotationRef.current = target;
    applyPositions(target);
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const next: Record<number, boolean> = {};
      timelineData.forEach((i) => { next[i.id] = false; });
      next[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const pulse: Record<number, boolean> = {};
        getRelatedItems(id).forEach((r) => { pulse[r] = true; });
        setPulseEffect(pulse);
        centerOnNode(id);

        // Expanded node: pin z-index + full opacity
        const el = nodeRefs.current[id];
        if (el) { el.style.zIndex = "200"; el.style.opacity = "1"; }
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return next;
    });
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getStatusStyles = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":  return "text-violet-700 bg-violet-100 border-violet-300";
      case "in-progress": return "text-emerald-700 bg-emerald-50 border-emerald-300";
      default:           return "text-gray-500 bg-gray-100 border-gray-300";
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
            <div className="absolute w-20 h-20 rounded-full border border-violet-300/40 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-violet-200/30 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-lg" />
          </div>

          {/* Orbit ring */}
          <div
            className="absolute rounded-full border border-violet-300/50"
            style={{ width: radiusState * 2, height: radiusState * 2 }}
          />

          {timelineData.map((item, index) => {
            const isExpanded = expandedItems[item.id];
            const isRelated  = isRelatedToActive(item.id);
            const isPulsing  = pulseEffect[item.id];
            const Icon       = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute cursor-pointer"
                style={{
                  // Initial position; rAF will take over immediately
                  transform: "translate(0px, 0px) translateZ(0)",
                  willChange: "transform, opacity",
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Energy halo */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
                    width:  `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left:   `-${(item.energy * 0.5) / 2}px`,
                    top:    `-${(item.energy * 0.5) / 2}px`,
                  }}
                />

                {/* Node icon */}
                <div className={[
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm",
                  "transition-colors duration-300",
                  isExpanded
                    ? "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/40 scale-150"
                    : isRelated
                    ? "bg-violet-100 text-violet-700 border-violet-400 animate-pulse"
                    : "bg-white text-violet-600 border-violet-200",
                ].join(" ")}>
                  <Icon size={16} />
                </div>

                {/* Label */}
                <div
                  className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-colors duration-300 ${isExpanded ? "text-violet-700" : "text-gray-500"}`}
                  style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
                >
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-white border-violet-200 shadow-xl shadow-violet-200/40">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-violet-300" />
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
                          <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400" style={{ width: `${item.energy}%` }} />
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
                              const rel = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 py-0 text-xs rounded-md border-violet-200 bg-transparent hover:bg-violet-50 text-gray-600 hover:text-violet-700 transition-colors cursor-pointer"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {rel?.title}
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
