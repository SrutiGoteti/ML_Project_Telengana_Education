import React, { useEffect, useState } from 'react';

const AIChatbot = ({ selectedSchool, isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your TS-Edu Policy Assistant. Select a school from the table to begin analysis.' }
  ]);

  useEffect(() => {
    if (selectedSchool) {
      const { name, str, ids, dvi, crs, facilities } = selectedSchool;
      
      let analysis = `Analyzing ${name}... \n\n`;
      analysis += `Current Risk Score: ${crs.score} (${crs.category} Priority). \n\n`;
      
      if (crs.score > 65) {
        analysis += "🔴 CRITICAL INTERVENTION REQUIRED: \n";
        if (parseFloat(str) > 40) {
          analysis += "- Immediate Teacher Rationalization: This school has an STR of " + str + ". Recommend deploying 2-3 surplus staff from nearby urban centers. \n";
        }
        if (ids > 50) {
          analysis += "- Emergency Infrastructure Fund: Deficit score is high (" + ids + "). ";
          if (!facilities.hasGirlsToilet) analysis += "Sanction Mana Ooru - Mana Badi funds for Component 1 (Toilets) to reduce female dropout risk. ";
          if (!facilities.hasWater) analysis += "Authorize immediate borewell repair. ";
        }
        if (dvi > 40) {
          analysis += "- Ground Inspection: High dropout vulnerability detected. Recommend MEO visit for community counseling.";
        }
      } else if (crs.score > 35) {
        analysis += "🟡 TARGETED IMPROVEMENTS: \n";
        analysis += "School is stable but requires proactive resource allocation to prevent slippage into high risk.";
      } else {
        analysis += "🟢 HEALTHY STATUS: \n";
        analysis += "Performance metrics are optimal. Continue routine monitoring.";
      }

      setMessages(prev => [...prev, 
        { role: 'user', text: `Analyze ${name}` },
        { role: 'ai', text: analysis }
      ]);
    }
  }, [selectedSchool]);

  return (
    <>
      <div className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
        🤖
      </div>

      {isOpen && (
        <div className="chat-window glass fade-in">
          <div className="chat-header">
            <span style={{ fontWeight: '600' }}>AI Policy Assistant</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role === 'ai' ? 'message-ai' : 'message-user'}`}>
                {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            ))}
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
            <input 
              type="text" 
              placeholder="Ask about school policies..." 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)',
                color: 'white',
                outline: 'none'
              }}
              readOnly
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
