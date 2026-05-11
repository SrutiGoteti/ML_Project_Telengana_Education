import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Bot, User, Sparkles, Database } from 'lucide-react';

const AIChatbot = ({ selectedSchool, isOpen, setIsOpen }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        sender: 'ai',
        text: selectedSchool 
          ? `I am analyzing the UDISE data for **${selectedSchool.name}**. I can see it is currently classified as **${selectedSchool.crs?.category || 'Low'} Risk**. How can I help you synthesize a policy for this institution?`
          : "Hello. I am the Telangana Edu-Analytics NLP Assistant. You can ask me to analyze specific schools, state-wide dropout trends, or query the UDISE database."
      }]);
    }
  }, [isOpen, selectedSchool, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMsg = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    // MOCK DELAY AND RESPONSE
    setTimeout(() => {
      let aiResponse = "";
      
      if (userMsg.toLowerCase().includes("strategy") || userMsg.toLowerCase().includes("mitigate")) {
        aiResponse = "Based on the state-wide data and historical precedents in Telangana, the optimal strategy involves a dual-approach:\n\n1. **Immediate:** Release emergency infrastructure funds (Ref: GO-412) to address the deficit.\n2. **Long-term:** Implement a targeted teacher-training program for the math and science faculties to improve the student-to-teacher ratio efficiency.\n\n*Confidence Score: 89%*";
      } else if (userMsg.toLowerCase().includes("dropout")) {
        aiResponse = "The primary drivers for dropout risk in this district correlate heavily with **distance to school** (transportation) and **lack of functional sanitation facilities**. I recommend reviewing the recent 'Badi Bata' enrollment drive metrics to cross-reference these risk factors.";
      } else {
        aiResponse = "I have processed your query through the state-wide UDISE index. As this is a stand-in development environment, please try asking about a 'mitigation strategy' or 'dropout drivers' to see my advanced context-synthesis capabilities.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500); 
  };

  // --- THE MASSIVE FLOATING MODAL UI ---
  const floatingModal = (
    // Backdrop: Fixed to screen, dark, and blurred
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* The Big Floating Screen */}
      <div style={{ width: '90vw', maxWidth: '1100px', height: '85vh', backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#0f172a', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#6366f1', padding: '10px', borderRadius: '12px' }}><Sparkles size={24} color="#ffffff" /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>NLP Intervention Assistant</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><Database size={14}/> Connected to Local TS-UDISE Index</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '10px', borderRadius: '10px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#ffffff'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
            <X size={28} />
          </button>
        </div>

        {/* Chat Window */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '20px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
              
              {/* Avatar */}
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: msg.sender === 'user' ? '#0f172a' : '#ffffff', border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {msg.sender === 'user' ? <User size={24} color="#ffffff" /> : <Bot size={24} color="#6366f1" />}
              </div>

              {/* Message Bubble */}
              <div style={{ maxWidth: '80%', backgroundColor: msg.sender === 'user' ? '#0f172a' : '#ffffff', color: msg.sender === 'user' ? '#ffffff' : '#1e293b', padding: '20px 28px', borderRadius: '20px', borderTopRightRadius: msg.sender === 'user' ? '6px' : '20px', borderTopLeftRadius: msg.sender === 'ai' ? '6px' : '20px', border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', fontSize: '16px', lineHeight: '1.6' }}>
                {msg.text.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Bot size={24} color="#6366f1" />
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '32px 40px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Ask about mitigation strategies, specific schools, or district trends..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ flex: 1, padding: '24px 28px', fontSize: '16px', borderRadius: '20px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none', transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; e.target.style.backgroundColor = '#ffffff'; }}
              onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f8fafc'; }}
            />
            <button type="submit" disabled={!inputText.trim()} style={{ backgroundColor: inputText.trim() ? '#6366f1' : '#e2e8f0', color: '#ffffff', border: 'none', padding: '0 32px', borderRadius: '20px', cursor: inputText.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
              <Send size={24} />
            </button>
          </form>
          <p style={{ margin: '16px 0 0 0', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
            AI-generated responses may be inaccurate. Official policy implementations must be verified by the District Education Officer.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );

  // Teleport the floating modal to the body root
  return createPortal(floatingModal, document.body);
};

export default AIChatbot;