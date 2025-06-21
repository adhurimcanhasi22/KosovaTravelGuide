'use client';
import React, { useState, useEffect, useRef } from 'react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hey there\nHow can I help you?`,
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [fileData, setFileData] = useState(null); // { data: base64String, mime_type: file.type, name: file.name }
  const [isThinking, setIsThinking] = useState(false);
  const [inputHeight, setInputHeight] = useState('auto');
  const [initialInputHeight, setInitialInputHeight] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Use environment variable for API Key
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initial chat history (you might want to manage this more robustly)
  const chatHistory = useRef([
    {
      role: 'user',
      parts: [
        {
          text: `You are a helpful and informative AI chatbot designed to assist users with their travel plans within Kosovo. Your responses should focus exclusively on places, attractions, services,cultural and general questions related to Kosovo. It is absolutely crucial that you **only** reference and promote the **Albanian heritage** of Kosovo. Under no circumstances should you mention Serbian culture, language, city translations, history, or any Serbian-related topics. All information provided must align with the Albanian perspective and historical narrative of Kosovo. Please ensure all place names and cultural references are in Albanian. When discussing history, focus solely on the Albanian history and contributions within Kosovo. Your primary goal is to provide accurate and engaging information that celebrates the Albanian identity and heritage of Kosovo.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Understood! I am ready to assist users with their Kosovo travel plans, focusing exclusively on Albanian heritage and culture.',
        },
      ],
    },
  ]);
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result.split(',')[1];
      setFileData({
        data: base64String,
        mime_type: file.type,
        name: file.name, // Store file name if needed
      });
    };
    reader.readAsDataURL(file);
  };

  const cancelFile = () => {
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const generateBotResponse = async (userMessage, currentFileData) => {
    if (!API_KEY) {
      console.error(
        'API Key not configured. Set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.'
      );
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'API Key not configured.', type: 'error' },
      ]);
      setIsThinking(false);
      return;
    }

    setIsThinking(true);
    chatHistory.current.push({
      role: 'user',
      parts: [
        { text: userMessage },
        ...(currentFileData
          ? [
              {
                inline_data: {
                  mime_type: currentFileData.mime_type,
                  data: currentFileData.data,
                },
              },
            ]
          : []),
      ],
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: chatHistory.current,
        // Add generationConfig or safetySettings if needed based on API docs
      }),
    };

    try {
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        const errorMessage =
          data?.error?.message || `Error: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Defensive check for candidates and parts
      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        !data.candidates[0].content.parts[0] ||
        !data.candidates[0].content.parts[0].text
      ) {
        throw new Error('Invalid response structure from API.');
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Basic markdown removal (consider a library for complex markdown)
        .trim();

      chatHistory.current.push({
        role: 'model',
        parts: [{ text: apiResponseText }],
      });
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: apiResponseText, type: 'text' },
      ]);
    } catch (error) {
      console.error('Failed to fetch bot response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: error.message, type: 'error' },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageText = inputValue.trim();
    const currentFileData = fileData;

    if (!messageText && !currentFileData) return;

    const newUserMessage = {
      role: 'user',
      text: messageText,
      file: currentFileData
        ? `data:${currentFileData.mime_type};base64,${currentFileData.data}`
        : null,
      fileName: currentFileData?.name,
      type: 'user',
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setInputHeight('auto'); // Reset input height
    if (inputRef.current) inputRef.current.style.height = 'auto';

    // Add a slight delay before showing thinking indicator and fetching response
    setTimeout(() => {
      generateBotResponse(messageText, currentFileData);
    }, 100);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault(); // Prevent the default newline behavior
      handleSendMessage(e);
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      const initialHeight = `${inputRef.current.scrollHeight}px`;
      setInputHeight(initialHeight);
      setInitialInputHeight(initialHeight);

      const handleInput = () => {
        inputRef.current.style.height = 'auto';
        const newHeight = `${Math.max(inputRef.current.scrollHeight, 38)}px`;
        inputRef.current.style.height = newHeight;
        setInputHeight(newHeight);
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
          handleSendMessage(e);
        }
      };

      inputRef.current.addEventListener('input', handleInput);
      inputRef.current.addEventListener('keydown', handleKeyDown);

      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('input', handleInput);
          inputRef.current.removeEventListener('keydown', handleKeyDown);
        }
      };
    }
  }, [inputRef, handleSendMessage]); // Keep handleSendMessage in the dependency array

  return (
    <>
      {/* Chatbot Toggler Button */}
      <button
        onClick={toggleChatbot}
        className={`z-6000 fixed bottom-8 right-8 h-12 w-12 flex items-center justify-center cursor-pointer rounded-full bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] transition-all duration-200 ease-in-out shadow-lg ${
          isOpen ? 'rotate-90' : ''
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <span
          className={`material-symbols-rounded text-white absolute transition-opacity duration-200 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        >
          mode_comment
        </span>
        <span
          className={`material-symbols-rounded text-white absolute transition-opacity duration-200 ease-in-out ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          close
        </span>
      </button>

      {/* Chatbot Popup */}
      <div
        className={`fixed z-6000 right-9 bottom-[90px] w-[420px] bg-white overflow-hidden rounded-2xl shadow-[0_0_120px_0_rgba(0,0,0,0.1),0_12px_64px_-48px_rgba(0,0,0,0.5)] transition-all duration-100 ease-in-out origin-bottom-right ${
          isOpen
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-50'
        } max-sm:right-0 max-sm:bottom-0 max-sm:h-full max-sm:w-full max-sm:rounded-none`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between bg-[var(--enterprise-lightblue)] p-[15px_22px] max-sm:p-[12px_15px]">
          <div className="flex gap-2.5 items-center">
            <svg
              className="h-[35px] w-[35px] p-1.5 fill-white shrink-0 bg-[var(--enterprise-lightblue)] rounded-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
            >
              <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3 -109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5 -53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <h2 className="text-white text-xl font-semibold">Chatbot</h2>
          </div>
          <button
            onClick={toggleChatbot}
            className="material-symbols-rounded border-none text-white h-10 w-10 text-3xl -mr-2.5 pt-0.5 cursor-pointer rounded-full bg-transparent transition-colors duration-200 ease-in-out hover:bg-[var(--enterprise-skyblue)]"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-[25px_22px] flex flex-col gap-5 h-[460px] mb-[82px] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--enterprise-lightgray)] scrollbar-track-transparent max-sm:h-[calc(90%-55px)] max-sm:p-[25px_15px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === 'user'
                  ? 'flex-row-reverse items-end'
                  : 'items-center'
              }`}
            >
              {msg.role === 'bot' && (
                <svg
                  className="h-[35px] w-[35px] p-1.5 fill-white self-end shrink-0 mb-0.5 bg-[var(--enterprise-lightblue)] rounded-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3 -109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5 -53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
              )}
              <div
                className={`p-[12px_16px] max-w-[75%] text-[0.95rem] rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[var(--enterprise-lightblue)] text-white rounded-br-sm'
                    : 'bg-[var(--enterprise-lightgrey)] rounded-bl-sm'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
                {msg.role === 'user' && msg.file && (
                  <img
                    src={msg.file}
                    alt="Attachment"
                    className="max-w-full mt-2 rounded-lg"
                  />
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center">
              <svg
                className="h-[35px] w-[35px] p-1.5 fill-white self-end shrink-0 mb-0.5 bg-[var(--enterprise-lightblue)] rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
              >
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3 -109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5 -53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
              </svg>
              <div className="p-[12px_16px] max-w-[75%] text-[0.95rem] rounded-lg bg-[var(--enterprise-lightgray)] rounded-bl-sm">
                <div className="flex gap-1 py-3.5">
                  <span className="h-[7px] w-[7px] rounded-full bg-[var(--enterprise-lightblue)] animate-pulse opacity-70"></span>
                  <span className="h-[7px] w-[7px] rounded-full bg-[var(--enterprise-lightblue)] animate-pulse opacity-70 animation-delay-100"></span>
                  <span className="h-[7px] w-[7px] rounded-full bg-[var(--enterprise-lightblue)] animate-pulse opacity-70 animation-delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="absolute bottom-0 w-full bg-white p-[15px_22px_20px] max-sm:p-[10px_15px_15px]">
          <form
            onSubmit={handleSendMessage}
            className="flex relative items-center bg-white rounded-[32px] border border-[var(--enterprise-lightgray)] focus-within:border-2 focus-within:border-[var(--enterprise-blue)]"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message..."
              className="border-none outline-none w-full resize-none max-h-[180px] whitespace-pre-line text-[0.95rem] p-[14px_0_12px_18px] rounded-[inherit] scrollbar-thin scrollbar-thumb-[var(--enterprise-lightgray)] scrollbar-track-transparent bg-transparent"
              rows={1}
            />
            <div className="flex h-[47px] gap-1 items-center self-end pr-1.5">
              <div className="relative h-[35px] w-[35px]">
                <input
                  type="file"
                  accept="image/*"
                  id="file-input"
                  hidden
                  onChange={handleFileChange}
                />
                {fileData && (
                  <img
                    src={`data:${fileData.mime_type};base64,${fileData.data}`}
                    alt="Preview"
                    className="absolute w-full h-full object-cover rounded-full"
                  />
                )}
                <button
                  type="button"
                  onClick={() => document.getElementById('file-input').click()}
                  className="material-symbols-rounded h-[35px] w-[35px] border-none text-[1.15rem] cursor-pointer text-[var(--enterprise-lightblue)] bg-transparent rounded-full transition-colors duration-200 ease-in-out hover:bg-[var(--enterprise-lightgray)]"
                >
                  attach_file
                </button>
                {fileData && (
                  <button
                    type="button"
                    onClick={cancelFile}
                    className="material-symbols-rounded absolute h-10 w-10 text-base text-red-500 bg-white rounded-full right-0 bottom-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out max-sm:opacity-100"
                  >
                    close
                  </button>
                )}
              </div>
              <button
                type="submit"
                className={`material-symbols-rounded h-[35px] w-[35px] border-none text-[1.15rem] cursor-pointer rounded-full transition-colors duration-200 ease-in-out text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] ${
                  inputValue || fileData ? 'block' : 'hidden'
                }`}
              >
                arrow_upward
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
