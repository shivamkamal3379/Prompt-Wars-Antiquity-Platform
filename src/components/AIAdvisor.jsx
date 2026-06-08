import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, AlertCircle, Key, ChevronDown, ChevronUp } from 'lucide-react';

export default function AIAdvisor({ inputs, emissions }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to the bottom of the chat without shifting the page viewport
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Initial welcome message and automatic update when calculator state changes
  useEffect(() => {
    const welcome = generateInitialReport();
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: welcome,
        timestamp: new Date()
      }
    ]);
  }, [inputs, emissions.total]);

  // Inline markdown renderer to output clean styled JSX
  const parseInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-eco-300">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <h4 key={i} className="text-sm font-bold text-eco-400 mt-3 mb-1">{trimmed.replace('### ', '')}</h4>;
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={i} className="text-base font-bold text-eco-300 mt-4 mb-2">{trimmed.replace('## ', '')}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={i} className="list-disc list-inside text-xs text-slate-300 ml-2 mb-1 leading-relaxed">
            {parseInlineMarkdown(trimmed.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+\.\s)(.*)/);
        return (
          <li key={i} className="list-decimal list-inside text-xs text-slate-300 ml-2 mb-1 leading-relaxed">
            {parseInlineMarkdown(match[2])}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-xs text-slate-300 leading-relaxed mb-1.5">{parseInlineMarkdown(line)}</p>;
    });
  };

  // Generate a customized initial report based on the calculator inputs
  const generateInitialReport = () => {
    const total = emissions.total;
    const { energy, transport, flights, diet } = emissions.categories;
    
    // Find the highest category
    const categories = [
      { name: 'Home Energy', value: energy },
      { name: 'Commuting & Transit', value: transport },
      { name: 'Flights & Aviation', value: flights },
      { name: 'Dietary Choices', value: diet }
    ];
    categories.sort((a, b) => b.value - a.value);
    const highest = categories[0];

    let advice = `### Antiquity AI Executive Assessment 🌍\n`;
    advice += `Hello! I have analyzed your carbon footprint details. Your total emissions stand at **${total.toFixed(2)} metric tons of CO₂e/year**.\n\n`;

    if (total < 2.0) {
      advice += `🌟 **Outstanding!** Your lifestyle matches the IPCC 1.5°C climate stabilizer goal of **< 2.0 tons/year**. You are already a climate champion!\n\n`;
    } else if (total < 5.0) {
      advice += `🌿 **Good Effort!** You are below the global average (${4.7} tons). With a few strategic shifts, you can hit the critical target of **2.0 tons**.\n\n`;
    } else {
      advice += `⚠️ **High Impact Detected.** Your footprint of **${total.toFixed(2)} tons** exceeds standard planetary thresholds. Let's work together to optimize this.\n\n`;
    }

    advice += `### 🔍 Key Insight\n`;
    advice += `Your primary driver of emissions is **${highest.name}**, contributing **${highest.value} tons** (${Math.round((highest.value / (total || 1)) * 100)}% of your total).\n\n`;

    advice += `### 💡 Personalized Recommendations:\n`;

    // Category-specific advice with actual mathematical projections
    let count = 1;
    if (inputs.carDist > 0 && (inputs.carType === 'petrol' || inputs.carType === 'diesel')) {
      const factor = inputs.carType === 'petrol' ? 0.17 : 0.19;
      const weeklyCommute = Math.round(inputs.carDist / 4.3);
      const savings = (weeklyCommute * 0.4 * factor * 52) / 1000; // 40% reduction
      advice += `${count++}. **Green Commuting:** Your ${inputs.carType} vehicle generates significant CO₂. Swapping 40% of commutes for public transit or cycling will save **${(savings * 1000).toFixed(0)} kg of CO₂/year**.\n`;
    }

    if (inputs.electricity > 350) {
      const electricitySavings = (inputs.electricity * 0.2 * 0.38 * 12); // 20% savings
      advice += `${count++}. **Smart Power:** Reducing standby devices and switching to LED bulbs could trim 20% of electricity usage, saving **${electricitySavings.toFixed(0)} kg of CO₂/year**.\n`;
    }

    if (inputs.gas > 200) {
      const gasSavings = (inputs.gas * 0.15 * 0.18 * 12);
      advice += `${count++}. **Thermal Efficiency:** Lowering your thermostat by 1.5°C or sealing drafts saves ~15% gas energy, cutting **${gasSavings.toFixed(0)} kg of CO₂/year**.\n`;
    }

    if (inputs.flightsShort > 5 || inputs.flightsLong > 10) {
      const flightSavings = ((inputs.flightsShort * 0.3 * 150) + (inputs.flightsLong * 0.15 * 110));
      advice += `${count++}. **Virtual Meetings:** Substituting 30% of short flights and 15% of long flights with video calls offsets **${flightSavings.toFixed(0)} kg of CO₂/year**.\n`;
    }

    if (inputs.diet === 'heavyMeat' || inputs.diet === 'averageMeat') {
      const targetDiet = inputs.diet === 'heavyMeat' ? 'vegetarian' : 'vegan';
      const savings = inputs.diet === 'heavyMeat' ? 1.6 : 1.0; // tons saved
      advice += `${count++}. **Dietary Shift:** Moving towards a **${targetDiet}** lifestyle will reduce agricultural impact, cutting your diet emissions by **${(savings * 1000).toFixed(0)} kg of CO₂/year**.\n`;
    }

    if (count === 1) {
      advice += `1. **Carbon Offsetting:** Since your footprint is extremely low, consider supporting verified forestry or carbon capture programs to offset the remaining **${total.toFixed(2)} tons**.\n`;
    }

    advice += `\n*Ask me a specific question below, such as "How can I start composting?" or "What are clean energy options?"*`;
    return advice;
  };

  // Simulated AI responses for specific user keywords
  const generateSimulatedReply = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('transport') || q.includes('car') || q.includes('commute') || q.includes('bike') || q.includes('transit')) {
      return `### Transport Footprint Deconstruction 🚲\n` +
             `To reduce transport emissions (currently **${emissions.categories.transport} tons/yr**):\n\n` +
             `*   **Telecommuting:** Working from home just 2 days a week cuts vehicle emissions by **40%**.\n` +
             `*   **Active Commuting:** Cycling or walking for journeys under 3km completely negates emissions. For a 10km weekly ride, you save ~**85kg of CO₂/year**.\n` +
             `*   **Eco-Driving:** Accelerate smoothly, maintain tyre pressure, and avoid idling. This improves fuel economy by **10-15%**.\n` +
             `*   **Public Transit:** Trains emit **80% less** CO₂ per passenger-km compared to single-occupancy petrol cars.`;
    }
    
    if (q.includes('energy') || q.includes('electricity') || q.includes('solar') || q.includes('power') || q.includes('gas') || q.includes('heating')) {
      return `### Household Energy Optimization 💡\n` +
             `Your home energy accounts for **${emissions.categories.energy} tons/yr**:\n\n` +
             `*   **Vampire Draw:** Unplug chargers, gaming systems, and TVs. Standby energy represents ~**10%** of an average electric bill.\n` +
             `*   **Heat Pump Conversion:** Replacing gas heaters with electric heat pumps reduces heating emissions by **60-80%** depending on grid greenness.\n` +
             `*   **Solar ROI:** A standard 5kW residential solar setup eliminates carbon from electricity entirely, paying for itself in 6-8 years.\n` +
             `*   **Cold Wash:** Washing laundry at 30°C instead of 40°C saves **38%** of the washing machine's electricity.`;
    }

    if (q.includes('diet') || q.includes('food') || q.includes('meat') || q.includes('vegan') || q.includes('vegetarian')) {
      return `### Diet & Agricultural Impact 🍏\n` +
             `Your food choices emit **${emissions.categories.diet} tons/yr**:\n\n` +
             `*   **Red Meat Reality:** Beef produces **60kg of greenhouse gases per kg of meat**—more than 10x poultry or tofu.\n` +
             `*   **Food Waste:** 30% of global food is wasted. Buying only what you need and composting scraps reduces methane emissions from landfills.\n` +
             `*   **Local & Seasonal:** Buying seasonal produce reduces energy spent on cold storage and greenhouses.\n` +
             `*   **Meatless Mondays:** Skipping meat just 1 day a week cuts annual emissions by **360kg of CO₂/year** (comparable to driving 1500km less!).`;
    }

    if (q.includes('flight') || q.includes('plane') || q.includes('travel') || q.includes('aviation')) {
      return `### Aviation Emissions Overview ✈️\n` +
             `Aviation emits **${emissions.categories.flights} tons/yr** in your profile:\n\n` +
             `*   **Radiative Forcing:** Aircraft emissions at altitude create vapor trails (cirrus clouds) which trap heat, causing **double** the warming effect of ground emissions.\n` +
             `*   **Alternative travel:** For trips under 600km, high-speed rail is **90% cleaner** than flying.\n` +
             `*   **Economy vs First:** First-class seats occupy more space and weight, giving them a carbon footprint **3x higher** than economy tickets.`;
    }

    if (q.includes('compost') || q.includes('waste') || q.includes('recycle') || q.includes('plastic')) {
      return `### Waste Management & Circular Economy ♻️\n` +
             `Reducing solid waste reduces landfill methane:\n\n` +
             `1. **Composting:** Organic waste in landfills decomposes anaerobically, generating methane (a greenhouse gas 28x more potent than CO₂). Composting allows aerobic decomposition, which is carbon-neutral.\n` +
             `2. **Single-Use Plastics:** Plastic production releases chemical gases. Carry reusable bottles, bags, and coffee cups.\n` +
             `3. **Upcycling:** Extend the life of textiles and electronics. Extending a phone's usage from 2 to 4 years cuts its manufacturing carbon footprint by **50%**.`;
    }

    return `### Antiquity AI Advisor Response 💬\n` +
           `Thank you for asking! Reducing your footprint of **${emissions.total.toFixed(2)} tons** is highly achievable through cumulative daily actions.\n\n` +
           `To explore further, try asking about one of these core topics:\n` +
           `*   **"How can I cut commuting emissions?"**\n` +
           `*   **"What is the impact of solar panels?"**\n` +
           `*   **"How does food waste affect my footprint?"**\n` +
           `*   **"Explain the impact of short-haul flights."**`;
  };

  // Call the live Google Gemini API client-side
  const callGeminiAPI = async (userPrompt) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Antiquity AI, a world-class sustainability expert and friendly carbon coach. You help the user understand and reduce their carbon footprint.
                    
                    User's Carbon Footprint Data:
                    - Total Annual Footprint: ${emissions.total.toFixed(2)} metric tons of CO2e/year
                    - Category Breakdown (tons/year):
                      * Home Energy: ${emissions.categories.energy} t
                      * Commuting/Transit: ${emissions.categories.transport} t
                      * Flights/Aviation: ${emissions.categories.flights} t
                      * Dietary Choices: ${emissions.categories.diet} t
                    
                    User's Calculator Inputs:
                    - Monthly Electricity: ${inputs.electricity} kWh
                    - Monthly Heating/Gas: ${inputs.gas} kWh
                    - Commute Distance: ${inputs.carDist} km/month (Car: ${inputs.carType})
                    - Transit Commute: ${inputs.publicTransit} hours/month
                    - Short-haul flight hours: ${inputs.flightsShort} hours/year
                    - Long-haul flight hours: ${inputs.flightsLong} hours/year
                    - Diet type: ${inputs.diet}

                    Provide highly specific, actionable, encouraging suggestions matching these values. Use exact numeric predictions if helpful. Format your output using clear markdown (subheadings, lists, bold text). Keep responses concise (around 150-200 words).
                    
                    User Question: ${userPrompt}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error(data.error?.message || 'Invalid response format from Gemini API.');
      }
    } catch (error) {
      console.warn('Gemini API call warning (using fallback engine):', error.message);
      return `⚠️ **Gemini API Key Required or Offline Fallback Active:** Using Antiquity Local AI Engine.\n\n` + generateSimulatedReply(userPrompt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (textToSend = inputValue) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    let aiResponseText = '';
    if (apiKey.trim()) {
      aiResponseText = await callGeminiAPI(textToSend);
    } else {
      // Small simulated delay for organic feel
      await new Promise(resolve => setTimeout(resolve, 800));
      aiResponseText = generateSimulatedReply(textToSend);
      setIsLoading(false);
    }

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const PRESETS = [
    'How do I reduce my commute emissions?',
    'What is the impact of diet changes?',
    'Tell me about vampire energy loads.',
    'How can composting help?'
  ];

  return (
    <div className="glass-panel flex flex-col h-[520px] overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center text-white shadow-md shadow-eco-500/20">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-100">Antiquity Advisor</span>
              <span className="inline-flex items-center bg-eco-500/10 text-eco-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-eco-500/20">
                <Sparkles size={10} className="mr-0.5" /> Client AI
              </span>
            </div>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse"></span>
              {apiKey ? 'Gemini 2.5 Active' : 'Simulated Agent Active'}
            </span>
          </div>
        </div>

        {/* API Key Toggle Button */}
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
            apiKey 
              ? 'border-eco-500/30 text-eco-400 bg-eco-950/20' 
              : 'border-slate-800 text-slate-400 bg-slate-950/20 hover:border-slate-700'
          }`}
        >
          <Key size={12} />
          {apiKey ? 'API Active' : 'Set Gemini Key'}
          {showKeyInput ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>
      </div>

      {/* API Key Input Panel */}
      {showKeyInput && (
        <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40 text-xs space-y-2 animate-scale-in">
          <div className="flex items-start gap-2 text-slate-400">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-gold-400" />
            <p className="leading-relaxed text-[11px]">
              Add a client-side Google Gemini API Key. The key is kept purely in your browser session and connects directly to Google. If left empty, Antiquity runs its local sustainability agent.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="glass-input flex-1 py-1.5 text-xs font-mono"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="btn-primary py-1.5 px-3.5 text-xs font-bold"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 ${
                msg.sender === 'user'
                  ? 'bg-eco-600 text-white rounded-br-none shadow-md shadow-eco-600/10'
                  : 'bg-slate-900/70 border border-slate-800/80 rounded-bl-none text-slate-100'
              }`}
            >
              {msg.sender === 'ai' ? (
                <div className="space-y-1.5">
                  {renderMarkdown(msg.text)}
                </div>
              ) : (
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              )}
              <span className={`text-[9px] block mt-1 text-right ${msg.sender === 'user' ? 'text-eco-200' : 'text-slate-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400 animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Quick Prompts */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSend(preset)}
              className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700/60 hover:text-slate-300 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/20 flex gap-2 items-center">
        <input
          id="chat-input"
          aria-label="Ask Antiquity AI Advisor"
          type="text"
          placeholder="Ask Antiquity AI Advisor..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          className="glass-input flex-1 py-2 text-xs placeholder:text-slate-600"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputValue.trim()}
          className="btn-primary p-2 rounded-xl flex-shrink-0"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

import PropTypes from 'prop-types';

AIAdvisor.propTypes = {
  inputs: PropTypes.shape({
    electricity: PropTypes.number.isRequired,
    gas: PropTypes.number.isRequired,
    carDist: PropTypes.number.isRequired,
    carType: PropTypes.string.isRequired,
    publicTransit: PropTypes.number.isRequired,
    flightsShort: PropTypes.number.isRequired,
    flightsLong: PropTypes.number.isRequired,
    diet: PropTypes.string.isRequired,
  }).isRequired,
  emissions: PropTypes.shape({
    total: PropTypes.number.isRequired,
    categories: PropTypes.shape({
      energy: PropTypes.number.isRequired,
      transport: PropTypes.number.isRequired,
      flights: PropTypes.number.isRequired,
      diet: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
