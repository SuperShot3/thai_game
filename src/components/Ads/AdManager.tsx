import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const AdContainer = styled.div`
  width: 100%;
  max-width: 728px;
  margin: 20px auto;
  min-height: 90px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CommercialModeButton = styled.button`
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  margin: 10px;

  &:hover {
    background: #27ae60;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
`;

interface AdManagerProps {
  isCommercialMode: boolean;
  onToggleCommercialMode: () => void;
}

const AdManager: React.FC<AdManagerProps> = ({ isCommercialMode, onToggleCommercialMode }) => {
  const [adInterval, setAdInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load AdSense script
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      if (adInterval) {
        clearInterval(adInterval);
      }
    };
  }, [adInterval]);

  useEffect(() => {
    if (isCommercialMode) {
      // Show ads every 2 minutes
      const interval = setInterval(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error('Ad refresh error:', err);
        }
      }, 120000); // 2 minutes

      setAdInterval(interval);
    } else if (adInterval) {
      clearInterval(adInterval);
      setAdInterval(null);
    }
  }, [isCommercialMode, adInterval]);

  return (
    <>
      <CommercialModeButton
        onClick={onToggleCommercialMode}
        disabled={isCommercialMode}
      >
        {isCommercialMode ? 'Commercial Mode Active' : 'Enable Commercial Mode'}
      </CommercialModeButton>

      {isCommercialMode && (
        <AdContainer>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="YOUR-AD-CLIENT-ID"
            data-ad-slot="YOUR-AD-SLOT-ID"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </AdContainer>
      )}
    </>
  );
};

export default AdManager; 