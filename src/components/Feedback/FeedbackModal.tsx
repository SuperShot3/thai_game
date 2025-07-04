import React, { useState } from 'react';
import styled from 'styled-components';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }

  &::placeholder {
    color: #999;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ variant }) => variant === 'primary' ? `
    background: #2196f3;
    color: white;
    
    &:hover {
      background: #1976d2;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  ` : `
    background: #f5f5f5;
    color: #333;
    
    &:hover {
      background: #e0e0e0;
    }
  `}
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
  
  ${({ type }) => type === 'success' ? `
    background: #e8f5e8;
    color: #2e7d32;
    border: 1px solid #4caf50;
  ` : `
    background: #ffebee;
    color: #c62828;
    border: 1px solid #f44336;
  `}
`;

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Method 1: Try JSON POST first
      let response;
      try {
        response = await fetch('https://script.google.com/macros/s/AKfycbzChuTWF5t658itIu8xRSKKVru42FJvoJAwB3c4sPNw9M1L2E2UmFhdoS8sy3qAKoSVNw/exec', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: message.trim() }),
        });
      } catch (jsonError) {
        console.log('JSON POST failed, trying form data:', jsonError);
        
        // Method 2: Try form data POST
        const formData = new FormData();
        formData.append('message', message.trim());
        
        response = await fetch('https://script.google.com/macros/s/AKfycbzChuTWF5t658itIu8xRSKKVru42FJvoJAwB3c4sPNw9M1L2E2UmFhdoS8sy3qAKoSVNw/exec', {
          method: 'POST',
          body: formData,
        });
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok || response.status === 200) {
        setSubmitStatus('success');
        setMessage('');
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      } else {
        console.error('Response not ok:', response.status, response.statusText);
        
        // Method 3: Fallback to hidden form submission
        console.log('Trying fallback form submission...');
        const success = await submitViaHiddenForm(message.trim());
        if (success) {
          setSubmitStatus('success');
          setMessage('');
          setTimeout(() => {
            onClose();
            setSubmitStatus('idle');
          }, 2000);
        } else {
          setSubmitStatus('error');
        }
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      
      // Try fallback method
      try {
        const success = await submitViaHiddenForm(message.trim());
        if (success) {
          setSubmitStatus('success');
          setMessage('');
          setTimeout(() => {
            onClose();
            setSubmitStatus('idle');
          }, 2000);
        } else {
          setSubmitStatus('error');
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback method using hidden form
  const submitViaHiddenForm = (messageText: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        // Create a hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbzChuTWF5t658itIu8xRSKKVru42FJvoJAwB3c4sPNw9M1L2E2UmFhdoS8sy3qAKoSVNw/exec';
        form.style.display = 'none';
        form.target = '_blank';

        // Create input field
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'message';
        input.value = messageText;

        // Add to form and submit
        form.appendChild(input);
        document.body.appendChild(form);
        
        // Submit and clean up
        setTimeout(() => {
          form.submit();
          document.body.removeChild(form);
          resolve(true);
        }, 100);
      } catch (error) {
        console.error('Hidden form submission failed:', error);
        resolve(false);
      }
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage('');
      setSubmitStatus('idle');
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>💬 Send Feedback</Title>
        
        {submitStatus === 'success' && (
          <Message type="success">
            ✅ Thank you! Your feedback has been submitted successfully.
          </Message>
        )}
        
        {submitStatus === 'error' && (
          <Message type="error">
            ❌ Sorry, there was an error submitting your feedback. Please try again.
          </Message>
        )}

        <Form onSubmit={handleSubmit}>
          <TextArea
            placeholder="Tell us what you think about the game, report bugs, or suggest improvements..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            required
          />
          
          <ButtonContainer>
            <Button 
              type="button" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting || !message.trim()}
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </ButtonContainer>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FeedbackModal; 