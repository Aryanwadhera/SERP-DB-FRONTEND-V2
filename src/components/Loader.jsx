// src/components/Loader.jsx
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="terminal-loader">
        <div className="terminal-header">
          <div className="terminal-title">Terminal</div>
          <div className="terminal-controls">
            <div className="control close" />
            <div className="control minimize" />
            <div className="control maximize" />
          </div>
        </div>

        <div className="content">
          {/* First line: love message (static) */}
          <div className="love-message">
            Made with ❤️ by Aryan Wadhera and Devom B
          </div>

          {/* Second line: typed Loading... with extended timing */}
          <div className="text">Loading...</div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* 1) Longer type-and-delete cycle, so user sees "Loading..." typed out fully */

  @keyframes blinkCursor {
    50% {
      border-right-color: transparent;
    }
  }

  /* We'll use 8s total now, so the user sees the typed text longer */
  @keyframes typeAndDelete {
    /* 0%–10%: width = 0 => no text */
    0%, 10% {
      width: 0;
    }

    /* 25%–75%: width = 5em => "Loading..." fully typed for about 50% of the time */
    25%, 75% {
      width: 5em;
    }

    /* 90%–100%: go back to width 0 */
    90%, 100% {
      width: 0;
    }
  }

  .terminal-loader {
    width: 100%;
    max-width: 500px;
    height: 220px;
    background: #1c1c1c;
    border: 1px solid #ffffff3e;
    border-radius: 10px;
    overflow: hidden;
    margin: 20px auto; /* center horizontally */
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  }

  .terminal-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #343434;
    padding: 6px;
  }

  .terminal-controls {
    position: absolute;
    left: 10px;
    display: flex;
    gap: 7px;
  }

  .control {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #777;
  }
  .control.close {
    background-color: #e33;
  }
  .control.minimize {
    background-color: #ee0;
  }
  .control.maximize {
    background-color: #0b0;
  }

  .terminal-title {
    color: #eeeeeec1;
    font-size: 0.9rem;
  }

  .content {
    padding: 12px;
  }

  .love-message {
    color: rgb(0, 196, 0);
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 6px;
  }

  .text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid green;
    /* We'll do an 8s cycle with steps(11) for "Loading..." (8 letters + 3 punctuation = 11) */
    animation:
      typeAndDelete 8s steps(11) infinite,
      blinkCursor 0.5s step-end infinite alternate;
    color: rgb(0, 196, 0);
    font-weight: 600;
    font-size: 1rem;
  }
`;

export default Loader;
