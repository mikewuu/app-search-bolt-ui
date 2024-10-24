"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
}

export const TypewriterEffect: React.FC<TypewriterProps> = ({
  words,
  className = "",
}) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const fullText = words.map(word => word.text).join(" ");
    
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setText(fullText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [charIndex, words]);

  const getStyledText = () => {
    let currentPos = 0;
    return words.map((word, wordIdx) => {
      const start = currentPos;
      const end = start + word.text.length;
      const visibleText = text.slice(start, end);
      currentPos = end + 1; // +1 for space

      return (
        <span key={wordIdx} className={word.className}>
          {visibleText}
          {wordIdx < words.length - 1 && currentPos <= text.length && " "}
        </span>
      );
    });
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {getStyledText()}
      </motion.div>
    </div>
  );
};