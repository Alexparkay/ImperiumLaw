// @ts-ignore
const Vapi = require('@vapi-ai/web').default;
import { useState, useEffect, useCallback } from 'react';

// Define types for the props
interface VapiWidgetProps {
  onTranscriptUpdate?: (transcript: string) => void;
  onStatusChange?: (isActive: boolean) => void;
  isListening?: boolean;
  className?: string;
}

export default function VapiWidget({ 
  onTranscriptUpdate, 
  onStatusChange, 
  isListening = false,
  className = "" 
}: VapiWidgetProps) {
  const [vapiInstance, setVapiInstance] = useState<any>(null);

  // Initialize Vapi instance on component mount
  useEffect(() => {
    // Initialize with Vapi credentials
    const vapi = new Vapi("c739f467-9c0a-4d8f-a90b-58e67fbf763d");
    
    vapi.on('message', (message: any) => {
      if (message.type === 'transcript') {
        // Pass transcript to parent component
        onTranscriptUpdate?.(message.transcript);
      }
    });

    setVapiInstance(vapi);

    // Cleanup on unmount
    return () => {
      vapi.disconnect();
    };
  }, [onTranscriptUpdate]);

  // Handle status change effect
  useEffect(() => {
    if (!vapiInstance) return;

    if (isListening) {
      // Start the call with the assistant ID
      vapiInstance.start("51697f03-4cf3-4691-9da3-a0ca4bfb7e8d");
    } else if (vapiInstance) {
      // Stop the call
      vapiInstance.stop();
    }
  }, [isListening, vapiInstance]);

  // Elements for visualizing audio input (animated voice bars)
  const renderVoiceBars = useCallback(() => {
    if (!isListening) return null;
    
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        {[...Array(16)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 bg-accent-primary rounded-full animate-pulse" 
            style={{ 
              height: `${12 + Math.random() * 24}px`,
              animationDuration: `${0.6 + Math.random() * 0.5}s`,
              animationDelay: `${i * 0.05}s`
            }}
          />
        ))}
      </div>
    );
  }, [isListening, className]);

  return renderVoiceBars();
} 