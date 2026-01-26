"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Ember {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function SmokyBackground() {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    // Set window height for animation
    setWindowHeight(window.innerHeight);

    // Generate random embers (increased to 50)
    const emberColors = ["#FF4500", "#FF6B35", "#FFD700", "#FF8C00", "#DC143C"];
    const newEmbers = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 4,
      color: emberColors[Math.floor(Math.random() * emberColors.length)],
    }));
    setEmbers(newEmbers);

    // Generate sparks that appear randomly
    const newSparks = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 10,
    }));
    setSparks(newSparks);

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1A1A1A] to-[#0a0a0a]" />

      {/* Pulsing center glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(139,0,0,0.15) 0%, transparent 60%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Smoky layers - intensified */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(139,0,0,0.4) 0%, transparent 50%)",
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(139,0,0,0.4) 0%, transparent 50%)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -20, 0],
          opacity: [0.4, 0.3, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Additional smoke layer - top */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(50,50,50,0.5) 0%, transparent 40%)",
        }}
        animate={{
          y: [0, 30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom fire glow - intensified */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#8B0000]/40 via-[#FF4500]/20 to-transparent"
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary bottom glow */}
      <motion.div
        className="absolute bottom-0 left-1/4 right-1/4 h-32 bg-gradient-to-t from-[#FF6B35]/30 via-[#FFD700]/10 to-transparent blur-xl"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scaleX: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating embers - more and colorful */}
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            width: ember.size,
            height: ember.size,
            bottom: -10,
            backgroundColor: ember.color,
            boxShadow: `0 0 ${ember.size * 2}px ${ember.color}`,
          }}
          animate={{
            y: [0, -windowHeight - 100],
            x: [0, (Math.random() - 0.5) * 150],
            opacity: [0, 1, 1, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Random sparks - flash and disappear */}
      {sparks.map((spark) => (
        <motion.div
          key={`spark-${spark.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size,
            height: spark.size,
          }}
          animate={{
            opacity: [0, 0, 1, 0, 0],
            scale: [0, 0, 1.5, 0.5, 0],
          }}
          transition={{
            duration: 0.5,
            delay: spark.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 8 + 4,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Heat distortion effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{
          background:
            "linear-gradient(to top, rgba(255,69,0,0.05) 0%, transparent 100%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Side glows */}
      <motion.div
        className="absolute left-0 top-1/4 bottom-1/4 w-32 bg-gradient-to-r from-[#8B0000]/20 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/4 bottom-1/4 w-32 bg-gradient-to-l from-[#8B0000]/20 to-transparent"
        animate={{
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}
