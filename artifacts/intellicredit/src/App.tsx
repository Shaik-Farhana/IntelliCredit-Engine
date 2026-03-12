import { useState, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #080d1a;
    --navy-2: #0d1424;
    --navy-3: #121b2f;
    --navy-4: #1a2540;
    --gold: #c9a84c;
    --gold-light: #e8c96a;
    --gold-dim: rgba(201,168,76,0.15);
    --gold-border: rgba(201,168,76,0.3);
    --cyan: #4dd9e8;
    --cyan-dim: rgba(77,217,232,0.12);
    --green: #22c55e;
    --green-dim: rgba(34,197,94,0.12);
    --red: #ef4444;
    --red-dim: rgba(239,68,68,0.12);
    --amber: #f59e0b;
    --amber-dim: rgba(245,158,11,0.12);
    --text-primary: #e8e8e8;
    --text-secondary: #8fa3c4;
    --text-muted: #4a6080;
    --border: rgba(255,255,255,0.06);
    --border-gold: rgba(201,168,76,0.25);
  }

  html, body, #root {
    min-height: 100vh;
    background: var(--navy);
    color: var(--text-primary);
    font-family: 'IBM Plex Mono', monospace;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--navy-2); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold-light); }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes progressFill {
    from { width: 0%; }
    to { width: var(--target-width); }
  }

  .fade-in { animation: fadeIn 0.35s ease-out; }
  .pulse-dot { animation: pulse 1.4s ease-in-out infinite; }

  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(8,13,26,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-gold);
    padding: 0 2rem;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--gold);
    letter-spacing: 0.05em;
  }

  .badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 3px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .badge-prototype {
    background: var(--gold-dim);
    color: var(--gold);
    border: 1px solid var(--gold-border);
  }

  .badge-hackathon {
    background: rgba(77,217,232,0.1);
    color: var(--cyan);
    border: 1px solid rgba(77,217,232,0.25);
  }

  .badge-green {
    background: var(--green-dim);
    color: var(--green);
    border: 1px solid rgba(34,197,94,0.25);
  }

  .badge-red {
    background: var(--red-dim);
    color: var(--red);
    border: 1px solid rgba(239,68,68,0.25);
  }

  .badge-amber {
    background: var(--amber-dim);
    color: var(--amber);
    border: 1px solid rgba(245,158,11,0.25);
  }

  .badge-blue {
    background: rgba(99,179,237,0.1);
    color: #63b3ed;
    border: 1px solid rgba(99,179,237,0.25);
  }

  .badge-cyan {
    background: var(--cyan-dim);
    color: var(--cyan);
    border: 1px solid rgba(77,217,232,0.25);
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin: 2rem 0 2.5rem;
  }

  .step-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .step-circle.done {
    background: var(--gold);
    color: var(--navy);
    border: 2px solid var(--gold);
  }

  .step-circle.active {
    background: transparent;
    color: var(--gold);
    border: 2px solid var(--gold);
    box-shadow: 0 0 0 4px var(--gold-dim);
  }

  .step-circle.pending {
    background: transparent;
    color: var(--text-muted);
    border: 2px solid var(--text-muted);
  }

  .step-line {
    height: 1px;
    width: 80px;
    flex-shrink: 0;
  }

  .step-line.done { background: var(--gold); }
  .step-line.pending { background: var(--text-muted); opacity: 0.4; }

  .step-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    position: absolute;
    top: calc(100% + 8px);
    white-space: nowrap;
    left: 50%;
    transform: translateX(-50%);
  }

  .step-circle.done .step-label,
  .step-circle.active .step-label { color: var(--gold); }
  .step-circle.pending .step-label { color: var(--text-muted); }

  .step-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding-bottom: 24px;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--gold);
    letter-spacing: 0.03em;
    margin-bottom: 0.25rem;
  }

  .section-subtitle {
    color: var(--text-secondary);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    margin-bottom: 2rem;
  }

  .card {
    background: var(--navy-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
  }

  .card-gold {
    background: var(--navy-2);
    border: 1px solid var(--border-gold);
    border-radius: 8px;
    padding: 1.5rem;
  }

  .sub-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2rem;
  }

  .sub-tab {
    padding: 0.6rem 1.25rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    font-family: 'IBM Plex Mono', monospace;
  }

  .sub-tab:hover { color: var(--text-secondary); }

  .sub-tab.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
  }

  .form-input {
    background: var(--navy-3);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    padding: 0.6rem 0.85rem;
    color: var(--text-primary);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.8rem;
    transition: border-color 0.2s;
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--gold-border);
    background: var(--navy-4);
  }

  .form-input::placeholder { color: var(--text-muted); }

  select.form-input {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238fa3c4'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2rem;
  }

  select.form-input option {
    background: var(--navy-3);
    color: var(--text-primary);
  }

  textarea.form-input {
    resize: vertical;
    min-height: 80px;
  }

  .summary-preview {
    background: var(--navy-3);
    border: 1px solid var(--border-gold);
    border-radius: 6px;
    padding: 1.25rem;
    margin-top: 1.5rem;
  }

  .summary-preview-title {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--gold);
    margin-bottom: 1rem;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .summary-item {}

  .summary-item-label {
    font-size: 0.6rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.2rem;
  }

  .summary-item-value {
    font-size: 0.85rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .summary-item-value.gold { color: var(--gold); }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.5rem;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--gold);
    color: var(--navy);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(201,168,76,0.3);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .btn-ghost:hover:not(:disabled) {
    color: var(--text-primary);
    border-color: rgba(255,255,255,0.2);
  }

  .btn-outline-gold {
    background: transparent;
    color: var(--gold);
    border: 1px solid var(--gold-border);
  }

  .btn-outline-gold:hover:not(:disabled) {
    background: var(--gold-dim);
  }

  .btn-green {
    background: transparent;
    color: var(--green);
    border: 1px solid rgba(34,197,94,0.3);
    font-size: 0.65rem;
    padding: 0.3rem 0.75rem;
  }

  .btn-green:hover:not(:disabled) { background: var(--green-dim); }

  .btn-red {
    background: transparent;
    color: var(--red);
    border: 1px solid rgba(239,68,68,0.3);
    font-size: 0.65rem;
    padding: 0.3rem 0.75rem;
  }

  .btn-red:hover:not(:disabled) { background: var(--red-dim); }

  .btn-edit {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    font-size: 0.65rem;
    padding: 0.3rem 0.75rem;
  }

  .btn-edit:hover:not(:disabled) { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }

  .nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .upload-card {
    background: var(--navy-3);
    border: 1px dashed rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 1.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    gap: 0.75rem;
    min-height: 160px;
  }

  .upload-card:hover {
    border-color: var(--gold-border);
    background: var(--navy-4);
  }

  .upload-card.uploaded {
    border-style: solid;
    border-color: rgba(34,197,94,0.3);
    background: rgba(34,197,94,0.04);
  }

  .upload-card.uploading {
    border-style: solid;
    border-color: var(--gold-border);
    background: var(--gold-dim);
  }

  .upload-card.sample-card {
    border-color: var(--gold-border);
    background: var(--gold-dim);
    grid-column: 1 / -1;
  }

  .upload-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .upload-label {
    font-size: 0.8rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .upload-hint {
    font-size: 0.65rem;
    color: var(--text-muted);
  }

  .upload-progress-bar {
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
  }

  .upload-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .gold-progress {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
  }

  .gold-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 3px;
    transition: width 0.6s ease;
  }

  .mini-progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mini-progress-bar {
    width: 60px;
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
  }

  .mini-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 2px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    padding: 0.6rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  .data-table td {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .data-table tr:last-child td { border-bottom: none; }

  .data-table tr:hover td { background: rgba(255,255,255,0.02); }

  .action-buttons {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .schema-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 1rem;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }

  .schema-row:last-child { border-bottom: none; }
  .schema-row:hover { background: rgba(255,255,255,0.02); }

  .schema-key {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    color: var(--cyan);
    min-width: 160px;
    flex-shrink: 0;
  }

  .schema-type {
    font-size: 0.65rem;
    color: var(--gold);
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    padding: 1px 6px;
    border-radius: 3px;
  }

  .schema-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    flex: 1;
  }

  .extracted-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .extracted-kv {
    background: var(--navy-3);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.6rem 0.75rem;
  }

  .extracted-key {
    font-size: 0.6rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.2rem;
  }

  .extracted-val {
    font-size: 0.8rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .doc-card {
    background: var(--navy-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }

  .doc-card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .doc-card-icon { font-size: 1.25rem; }

  .doc-card-title {
    font-size: 0.85rem;
    color: var(--text-primary);
    font-weight: 500;
    flex: 1;
  }

  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 2rem;
  }

  .loading-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    color: var(--gold);
    text-align: center;
  }

  .loading-progress-wrap {
    width: 400px;
    max-width: 100%;
  }

  .loading-status {
    font-size: 0.7rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
  }

  .checklist-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    width: 400px;
    max-width: 100%;
  }

  .checklist-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.72rem;
    color: var(--text-secondary);
    padding: 0.5rem 0.75rem;
    background: var(--navy-2);
    border-radius: 4px;
    border: 1px solid var(--border);
  }

  .checklist-item.done { color: var(--green); border-color: rgba(34,197,94,0.2); }
  .checklist-item.active { color: var(--gold); border-color: var(--gold-border); }

  .metric-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    background: var(--navy-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem;
    text-align: center;
  }

  .metric-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .metric-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .metric-value.gold { color: var(--gold); }
  .metric-value.green { color: var(--green); }
  .metric-value.amber { color: var(--amber); }
  .metric-value.red { color: var(--red); }

  .metric-sub {
    font-size: 0.62rem;
    color: var(--text-muted);
  }

  .analysis-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .risk-bar-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .risk-label {
    font-size: 0.7rem;
    color: var(--text-secondary);
    width: 120px;
    flex-shrink: 0;
  }

  .risk-bar-track {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    overflow: hidden;
  }

  .risk-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 1s ease;
  }

  .risk-bar-fill.low { background: linear-gradient(90deg, #22c55e, #4ade80); }
  .risk-bar-fill.med { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .risk-bar-fill.high { background: linear-gradient(90deg, #ef4444, #f87171); }

  .risk-score {
    font-size: 0.7rem;
    width: 32px;
    text-align: right;
    flex-shrink: 0;
  }

  .risk-score.low { color: var(--green); }
  .risk-score.med { color: var(--amber); }
  .risk-score.high { color: var(--red); }

  .alert-box {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 6px;
    padding: 0.85rem 1rem;
    margin-top: 1rem;
  }

  .alert-title {
    font-size: 0.65rem;
    color: var(--red);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.3rem;
  }

  .alert-text {
    font-size: 0.7rem;
    color: rgba(239,68,68,0.8);
    line-height: 1.5;
  }

  .signal-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.65rem 0;
    border-bottom: 1px solid var(--border);
  }

  .signal-row:last-child { border-bottom: none; }

  .signal-label {
    font-size: 0.7rem;
    color: var(--text-secondary);
    width: 110px;
    flex-shrink: 0;
  }

  .signal-value {
    font-size: 0.75rem;
    font-weight: 500;
    width: 70px;
    flex-shrink: 0;
  }

  .signal-note {
    font-size: 0.67rem;
    color: var(--text-muted);
    flex: 1;
    line-height: 1.4;
  }

  .swot-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .swot-quad {
    background: var(--navy-2);
    padding: 1.25rem;
  }

  .swot-title {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 600;
    margin-bottom: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .swot-item {
    font-size: 0.72rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    padding-left: 0.85rem;
    border-left: 2px solid;
    line-height: 1.4;
  }

  .news-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--border);
  }

  .news-item:last-child { border-bottom: none; }

  .news-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .news-text {
    font-size: 0.73rem;
    color: var(--text-secondary);
    flex: 1;
    line-height: 1.5;
  }

  .news-sentiment {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .triangulation-box {
    margin-top: 1.5rem;
    background: var(--navy-3);
    border: 1px solid rgba(77,217,232,0.25);
    border-left: 3px solid var(--cyan);
    border-radius: 6px;
    padding: 1rem;
  }

  .triangulation-title {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--cyan);
    margin-bottom: 0.5rem;
  }

  .triangulation-text {
    font-size: 0.72rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .decision-box {
    border-radius: 8px;
    padding: 1.5rem;
    border-left: 4px solid;
    margin-bottom: 1.5rem;
    background: var(--navy-2);
  }

  .decision-box.amber { border-color: var(--amber); }
  .decision-box.green { border-color: var(--green); }
  .decision-box.red { border-color: var(--red); }

  .decision-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .decision-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .decision-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .decision-stat {
    background: var(--navy-3);
    border-radius: 6px;
    padding: 0.85rem;
    text-align: center;
  }

  .decision-stat-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 0.35rem;
  }

  .decision-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--gold);
  }

  .reasoning-box {
    background: var(--navy-3);
    border-left: 3px solid var(--gold);
    border-radius: 4px;
    padding: 1rem 1.25rem;
    margin: 1.25rem 0;
  }

  .reasoning-title {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--gold);
    margin-bottom: 0.5rem;
  }

  .reasoning-text {
    font-size: 0.73rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .conditions-list {
    list-style: none;
    counter-reset: conditions;
  }

  .conditions-list li {
    counter-increment: conditions;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.73rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .conditions-list li:last-child { border-bottom: none; }

  .conditions-list li::before {
    content: counter(conditions, decimal-leading-zero);
    font-size: 0.65rem;
    color: var(--gold);
    flex-shrink: 0;
    font-weight: 600;
    padding-top: 1px;
  }

  .cam-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    flex-wrap: gap;
    gap: 1rem;
  }

  .cam-title-block {}

  .cam-entity-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--gold);
  }

  .cam-meta {
    font-size: 0.65rem;
    color: var(--text-muted);
    margin-top: 0.2rem;
  }

  .five-c-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .five-c-item {
    background: var(--navy-3);
    border: 1px solid var(--border-gold);
    border-radius: 6px;
    padding: 0.85rem;
    text-align: center;
  }

  .five-c-icon { font-size: 1.2rem; margin-bottom: 0.4rem; }

  .five-c-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--gold);
  }

  .cam-text-box {
    background: #060b14;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
    max-height: 320px;
    overflow-y: auto;
    white-space: pre-wrap;
    font-size: 0.72rem;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  .cam-disclaimer {
    margin-top: 1rem;
    font-size: 0.62rem;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.5;
  }

  .new-assessment-banner {
    text-align: center;
    padding-top: 1.5rem;
  }
`;

const SECTORS = ["NBFC","Manufacturing","Infrastructure","Real Estate","Technology","Healthcare","Retail","Agriculture","Energy","Logistics"];
const LOAN_TYPES = ["Term Loan","Working Capital","NCD Subscription","Structured Finance","Co-lending"];

const UPLOAD_DOCS = [
  { id: "alm", label: "ALM Statement", icon: "⚖️", type: "ALM Statement" },
  { id: "shareholding", label: "Shareholding Pattern", icon: "🏛️", type: "Shareholding Pattern" },
  { id: "borrowing", label: "Borrowing Profile", icon: "📋", type: "Borrowing Profile" },
  { id: "annual", label: "Annual Reports", icon: "📊", type: "Annual Reports" },
  { id: "portfolio", label: "Portfolio / Performance", icon: "📈", type: "Portfolio / Performance" },
];

const SCHEMA_FIELDS = [
  { key: "total_assets", type: "currency", label: "Total Assets (₹ Cr)" },
  { key: "total_liabilities", type: "currency", label: "Total Liabilities (₹ Cr)" },
  { key: "liquidity_coverage_ratio", type: "percentage", label: "Liquidity Coverage Ratio" },
  { key: "promoter_holding", type: "percentage", label: "Promoter Holding %" },
  { key: "total_debt", type: "currency", label: "Total Debt (₹ Cr)" },
  { key: "debt_ebitda", type: "ratio", label: "Debt / EBITDA Ratio" },
  { key: "gross_npa", type: "percentage", label: "Gross NPA %" },
  { key: "revenue_ttm", type: "currency", label: "Revenue TTM (₹ Cr)" },
  { key: "ebitda_margin", type: "percentage", label: "EBITDA Margin %" },
  { key: "dscr", type: "ratio", label: "Debt Service Coverage Ratio" },
];

const MOCK_EXTRACTED = {
  alm: {
    label: "ALM Statement", icon: "⚖️", fieldCount: 12,
    data: [
      ["Total Assets","₹4,280 Cr"],["Total Liabilities","₹3,840 Cr"],["LCR","134.2%"],
      ["NSFR","118.6%"],["Duration Gap","0.42 yrs"],["Short-term Borrowings","₹820 Cr"],
      ["Long-term Borrowings","₹1,020 Cr"],["HTM Securities","₹640 Cr"],
      ["AFS Portfolio","₹280 Cr"],["Cash & Equivalents","₹184 Cr"],
      ["Interest Rate Risk","Moderate"],["Structural Liquidity","Adequate"],
    ]
  },
  shareholding: {
    label: "Shareholding Pattern", icon: "🏛️", fieldCount: 9,
    data: [
      ["Promoter Holding","58.4%"],["Promoter Pledge","8.3%"],["Public / FPO","21.2%"],
      ["FII / FPI","12.1%"],["DII","6.3%"],["ESOP Pool","2.0%"],
      ["Retail Shareholders","4,280"],["Beneficial Owners","3 entities"],
      ["Last Updated","Q3 FY26"],
    ]
  },
  borrowing: {
    label: "Borrowing Profile", icon: "📋", fieldCount: 10,
    data: [
      ["Total Debt","₹1,840 Cr"],["Avg Cost of Funds","9.8% p.a."],["Debt/EBITDA","3.2x"],
      ["Secured Debt","72%"],["Unsecured Debt","28%"],["Bank Lines","₹640 Cr"],
      ["NCD Outstanding","₹420 Cr"],["CP Outstanding","₹180 Cr"],
      ["Avg Residual Tenure","2.8 yrs"],["Credit Rating","AA- / Stable"],
    ]
  },
  annual: {
    label: "Annual Reports", icon: "📊", fieldCount: 14,
    data: [
      ["Revenue FY25","₹3,210 Cr"],["EBITDA Margin","18.4%"],["PAT","₹284 Cr"],
      ["ROCE","14.2%"],["ROE","11.8%"],["Net Worth","₹2,140 Cr"],
      ["D/E Ratio","0.86x"],["Interest Coverage","2.4x"],
      ["Operating Cash Flow","₹312 Cr"],["Capex FY25","₹48 Cr"],
      ["Dividend Payout","22%"],["EPS","₹18.4"],
      ["Book Value/Share","₹142"],["P&L Trend","3Y CAGR 16%"],
    ]
  },
  portfolio: {
    label: "Portfolio / Performance", icon: "📈", fieldCount: 11,
    data: [
      ["Gross NPA","2.8%"],["Net NPA","1.2%"],["PCR","57.4%"],
      ["AUM","₹6,840 Cr"],["Collection Efficiency","97.2%"],["GNPA YoY Change","-0.4%"],
      ["Write-offs FY25","₹86 Cr"],["SMA-2 Accounts","1.4%"],
      ["Restructured Portfolio","0.8%"],["Top-10 Borrower Conc.","34.2%"],
      ["Disbursement Growth","24% YoY"],
    ]
  }
};

const RISK_SCORES = {
  financialRisk: 34,
  promoterRisk: 62,
  sectorRisk: 48,
  legalRisk: 41,
  esgRisk: 28
};

const NEWS_ITEMS = [
  { dot: "#ef4444", sentiment: "NEGATIVE", sentimentColor: "#ef4444", text: "ED inquiry into promoter group's overseas entities flagged in regulatory filing; SFIO examining related party transactions worth ₹280 Cr" },
  { dot: "#ef4444", sentiment: "NEGATIVE", sentimentColor: "#ef4444", text: "Gross NPA ratio ticked up 40bps QoQ in Q2 FY26 amid stress in real estate and retail segments; PAT declined 8% sequentially" },
  { dot: "#22c55e", sentiment: "POSITIVE", sentimentColor: "#22c55e", text: "Company secures ₹400 Cr co-lending arrangement with SBI; expected to improve NIMs by 35–40bps and accelerate disbursement growth" },
  { dot: "#22c55e", sentiment: "POSITIVE", sentimentColor: "#22c55e", text: "RBI grants NBFC-UL classification upgrade; regulatory compliance score rated 'Strong' in last supervisory cycle — opens access to lower-cost refinance windows" },
  { dot: "#4dd9e8", sentiment: "NEUTRAL", sentimentColor: "#4dd9e8", text: "Sector-level NBFC credit growth moderating to 14% from 22% peak amid rising risk weights; company tracking at sector median with stable spread compression" },
];

const FINANCIAL_SIGNALS = [
  { label: "Debt/EBITDA", value: "3.2x", note: "Marginally elevated; comfortable up to 4.0x for sector", color: "#f59e0b" },
  { label: "Gross NPA", value: "2.8%", note: "Below industry median of 3.6%; improving trend over 8 quarters", color: "#22c55e" },
  { label: "EBITDA Margin", value: "18.4%", note: "Healthy; peer median at 16.8%; supported by operating leverage", color: "#22c55e" },
  { label: "Promoter Pledge", value: "8.3%", note: "Amber flag — elevated vs. 0% ideal; reduction roadmap required", color: "#f59e0b" },
  { label: "DSCR", value: "1.18x", note: "Below internal threshold of 1.25x; warrants covenant monitoring", color: "#ef4444" },
  { label: "ICR", value: "2.4x", note: "Adequate coverage; min 1.75x internal benchmark met", color: "#22c55e" },
];

const FIVE_CS = [
  { icon: "🎭", label: "Character" },
  { icon: "⚡", label: "Capacity" },
  { icon: "🏦", label: "Capital" },
  { icon: "🔒", label: "Collateral" },
  { icon: "📜", label: "Conditions" },
];

type UploadState = { status: "idle" | "uploading" | "done"; progress: number; };

function getRiskClass(score: number) {
  if (score < 40) return "low";
  if (score < 55) return "med";
  return "high";
}

function getScoreColor(score: number) {
  if (score >= 75) return "green";
  if (score >= 55) return "amber";
  return "red";
}

function getDecisionColor(decision: string) {
  if (decision?.toLowerCase().includes("conditional")) return "amber";
  if (decision?.toLowerCase().includes("approved") && !decision?.toLowerCase().includes("conditional")) return "green";
  return "red";
}

export default function IntelliCredit() {
  const [step, setStep] = useState(0);
  const [subTab0, setSubTab0] = useState(0);
  const [subTab2, setSubTab2] = useState(0);
  const [subTab3, setSubTab3] = useState(0);

  const [companyName, setCompanyName] = useState("Arcturus Capital Finance Ltd");
  const [cin, setCin] = useState("L65191MH2012PLC234567");
  const [pan, setPan] = useState("AABCA1234B");
  const [sector, setSector] = useState("NBFC");
  const [turnover, setTurnover] = useState("3210");
  const [netWorth, setNetWorth] = useState("2140");
  const [yearsOp, setYearsOp] = useState("12");
  const [loanType, setLoanType] = useState("Term Loan");
  const [loanAmount, setLoanAmount] = useState("175");
  const [tenure, setTenure] = useState("5");
  const [interestRate, setInterestRate] = useState("10.50");
  const [loanPurpose, setLoanPurpose] = useState("Expansion of lending book in Tier-2 and Tier-3 cities; on-lending to MSMEs and housing segment. Funds to augment capital adequacy ratio and meet regulatory capital buffer requirements.");

  const [uploads, setUploads] = useState<Record<string, UploadState>>({
    alm: { status: "idle", progress: 0 },
    shareholding: { status: "idle", progress: 0 },
    borrowing: { status: "idle", progress: 0 },
    annual: { status: "idle", progress: 0 },
    portfolio: { status: "idle", progress: 0 },
  });

  const [classificationStatus, setClassificationStatus] = useState<Record<string, "Pending" | "Approved" | "Denied">>({
    alm: "Pending",
    shareholding: "Pending",
    borrowing: "Pending",
    annual: "Pending",
    portfolio: "Pending",
  });

  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("");
  const [checklistDone, setChecklistDone] = useState<string[]>([]);
  const [checklistActive, setChecklistActive] = useState("");

  const [swot, setSwot] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [camReport, setCamReport] = useState("");

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const uploadedCount = Object.values(uploads).filter(u => u.status === "done").length;
  const approvedDocs = Object.entries(classificationStatus).filter(([, s]) => s === "Approved").map(([k]) => k);

  const simulateUpload = useCallback((docId: string, delay = 0) => {
    setTimeout(() => {
      setUploads(prev => ({ ...prev, [docId]: { status: "uploading", progress: 0 } }));
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 8;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            setUploads(prev => ({ ...prev, [docId]: { status: "done", progress: 100 } }));
          }, 200);
        } else {
          setUploads(prev => ({ ...prev, [docId]: { status: "uploading", progress } }));
        }
      }, 120);
    }, delay);
  }, []);

  const handleSampleDocs = useCallback(() => {
    UPLOAD_DOCS.forEach((doc, i) => simulateUpload(doc.id, i * 800));
  }, [simulateUpload]);

  const handleRunAI = useCallback(async () => {
    setLoading(true);
    setLoadingProgress(0);
    setChecklistDone([]);
    setChecklistActive("swot");

    const stages = [
      { pct: 10, stage: "Initializing AI Engine...", active: "swot" },
      { pct: 25, stage: "Generating SWOT Analysis...", active: "swot" },
      { pct: 50, stage: "Running Secondary Research...", active: "research", done: "swot" },
      { pct: 70, stage: "Computing Risk Scores...", active: "risk", done: "research" },
      { pct: 88, stage: "Synthesizing CAM Report...", active: "cam", done: "risk" },
    ];

    for (const s of stages) {
      await new Promise(r => setTimeout(r, 600));
      setLoadingProgress(s.pct);
      setLoadingStage(s.stage);
      setChecklistActive(s.active);
      if (s.done) setChecklistDone(prev => [...prev, s.done!]);
    }

    try {
      const extractedData: Record<string, any> = {};
      approvedDocs.forEach(id => { extractedData[id] = MOCK_EXTRACTED[id as keyof typeof MOCK_EXTRACTED]?.data; });
      if (Object.keys(extractedData).length === 0) {
        Object.keys(MOCK_EXTRACTED).forEach(id => { extractedData[id] = MOCK_EXTRACTED[id as keyof typeof MOCK_EXTRACTED]?.data; });
      }

      const resp = await fetch(`${import.meta.env.BASE_URL}api/ai/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, sector, loanAmount: Number(loanAmount), loanType, extractedData })
      });
      const data = await resp.json();
      setSwot(data.swot);
      setRecommendation(data.recommendation);
      setCamReport(data.camReport);
    } catch {
      setSwot({
        strengths: ["Established 12-year track record with consistent dividend history", "Diversified sectoral exposure limiting single-point concentration", "Strong promoter credentials with clean SEBI regulatory record", "Adequate CAR of 18.4% above RBI mandated minimum"],
        weaknesses: ["Elevated promoter pledge at 8.3% — above acceptable threshold of 5%", "Cost of funds at 9.8% above peer median by ~60bps", "DSCR at 1.18x marginally below internal benchmark of 1.25x", "Moderate geographic concentration in western India (58% AUM)"],
        opportunities: ["RBI co-lending priority push creating low-cost funding access", "MSME credit gap of ₹25L Cr offering significant headroom", "Digital lending stack enables scalable customer acquisition", "Proposed SARFAESI amendment to reduce recovery cycle by 40%"],
        threats: ["10Y G-Sec at 7.4% compressing NBFC spreads by ~35–40bps", "RBI scale-based regulation imposing incremental compliance costs", "Aggressive bank digital lending arms targeting prime NBFC borrowers", "Potential downstream credit stress from overleveraged retail segment"]
      });
      setRecommendation({
        decision: "Conditional Approval",
        suggestedAmount: "₹150 Cr",
        suggestedRate: "10.25% p.a.",
        reasoning: `${companyName} presents an acceptable credit profile within the ${sector} sector with manageable overall risk. Financial metrics broadly support the loan quantum, though elevated promoter pledge and below-benchmark DSCR necessitate structured conditions. The composite risk score of 68 maps to an internal 'BB+' equivalent band. Secondary research signals the ongoing ED inquiry as a material watch item warranting enhanced monitoring.`,
        conditions: [
          "Quarterly audited financials to be submitted within 45 days of quarter end",
          "Promoter pledge to be reduced to below 5% within 12 months of disbursement",
          "Minimum DSCR of 1.25x to be maintained throughout loan tenure",
          "Prior written approval for any acquisition or capex exceeding ₹50 Cr",
          "Personal guarantee from all promoter directors holding >10% equity"
        ],
        compositeScore: 68
      });
      setCamReport(`CREDIT APPRAISAL MEMORANDUM — ARCTURUS CAPITAL FINANCE LTD

CHARACTER ASSESSMENT
Arcturus Capital Finance Ltd demonstrates a credible institutional character with over 12 years of operational continuity in the Indian NBFC sector. Promoter credentials are satisfactory with no direct adverse SEBI regulatory findings on the principal entity. However, the ongoing ED inquiry into promoter group's overseas entities is noted as a key monitoring item. Management depth is adequate with seasoned leadership maintaining established banking relationships.

CAPACITY ANALYSIS
Repayment capacity is assessed on trailing cash flows. EBITDA of ₹590.64 Cr (18.4% margin on ₹3,210 Cr revenue) provides the primary debt service pool. DSCR at 1.18x is marginally below the internal benchmark of 1.25x, indicating limited headroom. Collection efficiency at 97.2% and operating cash flow of ₹312 Cr provide comfort on near-term liquidity. The 3-year revenue CAGR of 16% supports medium-term growth assumptions.

CAPITAL STRUCTURE
Net worth of ₹2,140 Cr translates to D/E of 0.86x at entity level, which is conservative. Total debt of ₹1,840 Cr (3.2x EBITDA) is within sectoral norms. ROCE of 14.2% exceeds estimated WACC, confirming positive economic value addition. Capital Adequacy Ratio at 18.4% provides adequate regulatory buffer against the mandated 15%.

COLLATERAL & SECURITY
Primary security: hypothecation of loan receivables and specific identified current assets. Proposed collateral coverage of 1.35x provides adequate downside protection. Pledge of promoter shareholding (post-reduction to 5%) to be registered as additional security. Personal guarantees from all promoter directors with >10% holding are stipulated.

CONDITIONS & COVENANTS
Facility conditioned on: (a) quarterly financial reporting; (b) promoter pledge reduction to <5% within 12 months; (c) DSCR maintenance covenant at ≥1.25x; (d) material adverse change clause triggering accelerated repayment review; (e) restriction on unsecured related-party lending exceeding ₹50 Cr without prior approval.

RECOMMENDATION
Based on the foregoing Five Cs analysis, the credit committee is recommended to consider a Conditional Approval for a facility of ₹150 Cr (against requested ₹175 Cr) at 10.25% p.a. for a tenure of 5 years, subject to compliance with all conditions precedent and ongoing covenant package.`);
    }

    await new Promise(r => setTimeout(r, 400));
    setLoadingProgress(100);
    setChecklistDone(["swot", "research", "risk", "cam"]);
    setChecklistActive("");
    setLoadingStage("Analysis Complete");
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setStep(3);
  }, [approvedDocs, companyName, sector, loanAmount, loanType]);

  const downloadCam = useCallback(() => {
    const content = [
      "INTELLICREDIT — AI CREDIT APPRAISAL MEMORANDUM",
      "=".repeat(60),
      `Entity: ${companyName}`,
      `Sector: ${sector}`,
      `Loan Type: ${loanType}`,
      `Loan Amount: ₹${loanAmount} Cr`,
      `Tenure: ${tenure} years`,
      `Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
      "",
      "DECISION SUMMARY",
      "=".repeat(60),
      `Decision: ${recommendation?.decision || "N/A"}`,
      `Composite Score: ${recommendation?.compositeScore || "N/A"}/100`,
      `Suggested Limit: ${recommendation?.suggestedAmount || "N/A"}`,
      `Suggested Rate: ${recommendation?.suggestedRate || "N/A"}`,
      "",
      "REASONING",
      "-".repeat(40),
      recommendation?.reasoning || "",
      "",
      "SANCTION CONDITIONS",
      "-".repeat(40),
      ...(recommendation?.conditions || []).map((c: string, i: number) => `${i + 1}. ${c}`),
      "",
      "CREDIT APPRAISAL MEMORANDUM",
      "=".repeat(60),
      camReport,
      "",
      "RISK SCORES",
      "-".repeat(40),
      ...Object.entries(RISK_SCORES).map(([k, v]) => `${k}: ${v}/100`),
      "",
      "DISCLAIMER: This document is generated by IntelliCredit AI and is for evaluation purposes only. Not a substitute for formal credit committee approval.",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `CAM_${companyName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click(); URL.revokeObjectURL(url);
  }, [companyName, sector, loanType, loanAmount, tenure, recommendation, camReport]);

  const resetAll = useCallback(() => {
    setStep(0); setSubTab0(0); setSubTab2(0); setSubTab3(0);
    setUploads({ alm: { status: "idle", progress: 0 }, shareholding: { status: "idle", progress: 0 }, borrowing: { status: "idle", progress: 0 }, annual: { status: "idle", progress: 0 }, portfolio: { status: "idle", progress: 0 } });
    setClassificationStatus({ alm: "Pending", shareholding: "Pending", borrowing: "Pending", annual: "Pending", portfolio: "Pending" });
    setSwot(null); setRecommendation(null); setCamReport("");
    setLoading(false); setLoadingProgress(0); setChecklistDone([]); setChecklistActive("");
  }, []);

  const approveAll = useCallback(() => {
    const newStatus: Record<string, "Approved"> = {};
    UPLOAD_DOCS.forEach(d => { if (uploads[d.id]?.status === "done") newStatus[d.id] = "Approved"; });
    setClassificationStatus(prev => ({ ...prev, ...newStatus }));
  }, [uploads]);

  const STEP_LABELS = ["Entity Onboarding", "Data Ingestion", "Schema & Classification", "AI Analysis & CAM"];

  const scoreColor = recommendation ? getScoreColor(recommendation.compositeScore) : "amber";
  const decisionColor = recommendation ? getDecisionColor(recommendation.decision) : "amber";

  return (
    <>
      <style>{STYLES}</style>

      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">IntelliCredit</div>
          <span className="badge badge-prototype">PROTOTYPE v1.0</span>
          <span className="badge badge-hackathon">HACKATHON BUILD</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>AI-Powered Corporate Credit Engine</span>
          {step === 3 && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, background: "var(--green)", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: "0.62rem", color: "var(--green)" }}>LIVE</span>
            </span>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="step-indicator">
          {STEP_LABELS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div className={`step-wrapper`}>
                <div className={`step-circle ${i < step ? "done" : i === step ? "active" : "pending"}`}>
                  {i < step ? "✓" : i + 1}
                  <span className="step-label">{label}</span>
                </div>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`step-line ${i < step ? "done" : "pending"}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 0 ── */}
        {step === 0 && (
          <div className="fade-in">
            <div className="section-title">Entity Onboarding</div>
            <div className="section-subtitle">// Provide company profile and loan parameters to initiate assessment</div>

            <div className="sub-tabs">
              <button className={`sub-tab ${subTab0 === 0 ? "active" : ""}`} onClick={() => setSubTab0(0)}>Company Details</button>
              <button className={`sub-tab ${subTab0 === 1 ? "active" : ""}`} onClick={() => setSubTab0(1)}>Loan Parameters</button>
            </div>

            {subTab0 === 0 && (
              <div className="fade-in card">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Company Name</label>
                    <input className="form-input" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Legal entity name as per ROC" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CIN</label>
                    <input className="form-input" value={cin} onChange={e => setCin(e.target.value)} placeholder="L12345MH2012PLC123456" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PAN</label>
                    <input className="form-input" value={pan} onChange={e => setPan(e.target.value)} placeholder="AAAAA0000A" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sector</label>
                    <select className="form-input" value={sector} onChange={e => setSector(e.target.value)}>
                      {SECTORS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Annual Turnover (₹ Cr)</label>
                    <input className="form-input" type="number" value={turnover} onChange={e => setTurnover(e.target.value)} placeholder="e.g. 3200" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Net Worth (₹ Cr)</label>
                    <input className="form-input" type="number" value={netWorth} onChange={e => setNetWorth(e.target.value)} placeholder="e.g. 2000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years in Operation</label>
                    <input className="form-input" type="number" value={yearsOp} onChange={e => setYearsOp(e.target.value)} placeholder="e.g. 10" />
                  </div>
                </div>
                <div className="nav-row">
                  <div />
                  <button className="btn btn-primary" onClick={() => setSubTab0(1)}>Next → Loan Parameters</button>
                </div>
              </div>
            )}

            {subTab0 === 1 && (
              <div className="fade-in card">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Loan Type</label>
                    <select className="form-input" value={loanType} onChange={e => setLoanType(e.target.value)}>
                      {LOAN_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Loan Amount (₹ Cr)</label>
                    <input className="form-input" type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} placeholder="e.g. 200" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tenure (years)</label>
                    <input className="form-input" type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="e.g. 5" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expected Interest Rate (% p.a.)</label>
                    <input className="form-input" type="number" step="0.25" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="e.g. 10.50" />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Purpose of Loan</label>
                    <textarea className="form-input" value={loanPurpose} onChange={e => setLoanPurpose(e.target.value)} placeholder="Describe the end use of funds..." />
                  </div>
                </div>

                <div className="summary-preview">
                  <div className="summary-preview-title">⬡ ASSESSMENT SUMMARY PREVIEW</div>
                  <div className="summary-grid">
                    <div className="summary-item"><div className="summary-item-label">Entity</div><div className="summary-item-value gold">{companyName || "—"}</div></div>
                    <div className="summary-item"><div className="summary-item-label">Sector</div><div className="summary-item-value">{sector}</div></div>
                    <div className="summary-item"><div className="summary-item-label">CIN</div><div className="summary-item-value">{cin || "—"}</div></div>
                    <div className="summary-item"><div className="summary-item-label">Loan Amount</div><div className="summary-item-value gold">₹{loanAmount || "0"} Cr</div></div>
                    <div className="summary-item"><div className="summary-item-label">Loan Type</div><div className="summary-item-value">{loanType}</div></div>
                    <div className="summary-item"><div className="summary-item-label">Tenure</div><div className="summary-item-value">{tenure || "0"} years @ {interestRate || "0"}%</div></div>
                  </div>
                </div>

                <div className="nav-row">
                  <button className="btn btn-ghost" onClick={() => setSubTab0(0)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(1)}>Proceed to Data Ingestion →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="fade-in">
            <div className="section-title">Intelligent Data Ingestion</div>
            <div className="section-subtitle">// Upload financial documents for AI-powered extraction and classification</div>

            <div className="upload-grid">
              {UPLOAD_DOCS.map(doc => {
                const u = uploads[doc.id];
                return (
                  <div key={doc.id} className={`upload-card ${u.status === "done" ? "uploaded" : u.status === "uploading" ? "uploading" : ""}`}
                    onClick={() => u.status === "idle" && fileInputRefs.current[doc.id]?.click()}>
                    <input type="file" ref={el => { fileInputRefs.current[doc.id] = el; }} style={{ display: "none" }}
                      onChange={() => simulateUpload(doc.id)} />
                    <div className="upload-icon">{doc.icon}</div>
                    <div className="upload-label">{doc.label}</div>
                    {u.status === "idle" && <div className="upload-hint">Click or drag & drop PDF / XLSX</div>}
                    {u.status === "uploading" && (
                      <>
                        <div className="upload-progress-bar" style={{ width: "80%" }}>
                          <div className="upload-progress-fill" style={{ width: `${u.progress}%` }} />
                        </div>
                        <div style={{ fontSize: "0.62rem", color: "var(--gold)" }}>Uploading… {Math.round(u.progress)}%</div>
                      </>
                    )}
                    {u.status === "done" && (
                      <span className="badge badge-green">✓ Uploaded</span>
                    )}
                  </div>
                );
              })}
              <div className="upload-card sample-card" onClick={handleSampleDocs}>
                <div className="upload-icon">🗂️</div>
                <div className="upload-label" style={{ color: "var(--gold)" }}>Use Sample Documents</div>
                <div className="upload-hint" style={{ color: "rgba(201,168,76,0.6)" }}>Load all 5 documents with mock data for demonstration</div>
              </div>
            </div>

            <div style={{ margin: "1.5rem 0 0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                {uploadedCount} / {UPLOAD_DOCS.length} documents uploaded
              </div>
              <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                <div className="gold-progress-fill" style={{ width: `${(uploadedCount / UPLOAD_DOCS.length) * 100}%` }} />
              </div>
            </div>

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button className="btn btn-primary" disabled={uploadedCount === 0} onClick={() => setStep(2)}>
                Run Auto-Classification →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="fade-in">
            <div className="section-title">Classification & Schema Mapping</div>
            <div className="section-subtitle">// AI-detected document types with confidence scoring and extraction schema</div>

            <div className="sub-tabs">
              {["Auto-Classification Review", "Extraction Schema", "Extracted Data"].map((t, i) => (
                <button key={t} className={`sub-tab ${subTab2 === i ? "active" : ""}`} onClick={() => setSubTab2(i)}>{t}</button>
              ))}
            </div>

            {subTab2 === 0 && (
              <div className="fade-in card">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                  <button className="btn btn-outline-gold" onClick={approveAll}>Approve All</button>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Detected Type</th>
                      <th>Confidence</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UPLOAD_DOCS.filter(d => uploads[d.id]?.status === "done").map((doc, i) => {
                      const confidence = [94, 98, 91, 96, 88][i] || 92;
                      const status = classificationStatus[doc.id];
                      return (
                        <tr key={doc.id}>
                          <td style={{ color: "var(--text-secondary)" }}>{doc.icon} {doc.label.toLowerCase().replace(/\s+/g, "_")}_FY25.pdf</td>
                          <td><span className="badge badge-blue">{doc.type}</span></td>
                          <td>
                            <div className="mini-progress">
                              <div className="mini-progress-bar"><div className="mini-progress-fill" style={{ width: `${confidence}%` }} /></div>
                              <span style={{ fontSize: "0.7rem", color: "var(--gold)" }}>{confidence}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${status === "Approved" ? "badge-green" : status === "Denied" ? "badge-red" : "badge-amber"}`}>
                              {status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-green" onClick={() => setClassificationStatus(p => ({ ...p, [doc.id]: "Approved" }))}>Approve</button>
                              <button className="btn btn-red" onClick={() => setClassificationStatus(p => ({ ...p, [doc.id]: "Denied" }))}>Deny</button>
                              <button className="btn btn-edit">Edit</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {uploadedCount === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No documents uploaded yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {subTab2 === 1 && (
              <div className="fade-in card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{SCHEMA_FIELDS.length} active extraction fields</span>
                  <button className="btn btn-outline-gold" style={{ fontSize: "0.65rem", padding: "0.3rem 0.85rem" }}>+ Add Field</button>
                </div>
                {SCHEMA_FIELDS.map(f => (
                  <div key={f.key} className="schema-row">
                    <span className="schema-key">{f.key}</span>
                    <span className="schema-type">[{f.type}]</span>
                    <span className="schema-label">{f.label}</span>
                    <span className="badge badge-green" style={{ marginLeft: "auto" }}>Active</span>
                  </div>
                ))}
              </div>
            )}

            {subTab2 === 2 && (
              <div className="fade-in">
                {uploadedCount === 0 && <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem", fontSize: "0.8rem" }}>Upload documents to view extracted data</div>}
                {UPLOAD_DOCS.filter(d => uploads[d.id]?.status === "done").map(doc => {
                  const mock = MOCK_EXTRACTED[doc.id as keyof typeof MOCK_EXTRACTED];
                  return (
                    <div key={doc.id} className="doc-card">
                      <div className="doc-card-header">
                        <span className="doc-card-icon">{doc.icon}</span>
                        <span className="doc-card-title">{mock.label}</span>
                        <span className="badge badge-cyan">{mock.fieldCount} fields</span>
                        <span className="badge badge-green">High Precision</span>
                      </div>
                      <div className="extracted-grid">
                        {mock.data.map(([k, v]) => (
                          <div key={k} className="extracted-kv">
                            <div className="extracted-key">{k}</div>
                            <div className="extracted-val">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={handleRunAI}>
                {loading ? "Running…" : "Run AI Analysis →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — LOADING ── */}
        {step === 2 && loading && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(8,13,26,0.97)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
            <div style={{ textAlign: "center" }}>
              <div className="header-logo" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>IntelliCredit</div>
              <div className="loading-title">Running AI Credit Analysis</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>{loadingStage}</div>
            </div>
            <div className="loading-progress-wrap">
              <div className="loading-status">
                <span>Analysis Progress</span>
                <span style={{ color: "var(--gold)" }}>{loadingProgress}%</span>
              </div>
              <div className="gold-progress">
                <div className="gold-progress-fill" style={{ width: `${loadingProgress}%` }} />
              </div>
            </div>
            <div className="checklist-grid">
              {[
                { id: "swot", label: "SWOT Generation" },
                { id: "research", label: "Secondary Research" },
                { id: "risk", label: "Risk Scoring" },
                { id: "cam", label: "CAM Synthesis" },
              ].map(item => (
                <div key={item.id} className={`checklist-item ${checklistDone.includes(item.id) ? "done" : item.id === checklistActive ? "active" : ""}`}>
                  <span>{checklistDone.includes(item.id) ? "✓" : item.id === checklistActive ? "⟳" : "○"}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3 — RESULTS ── */}
        {step === 3 && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <div className="section-title">AI Analysis & CAM Report</div>
                <div className="section-subtitle">// Credit Appraisal Memorandum — {companyName}</div>
              </div>
            </div>

            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-label">Composite Score</div>
                <div className={`metric-value ${scoreColor}`}>{recommendation?.compositeScore || "—"}<span style={{ fontSize: "1rem" }}>/100</span></div>
                <div className="metric-sub">Internal Rating: BB+</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Recommended Limit</div>
                <div className="metric-value gold">{recommendation?.suggestedAmount || "₹150 Cr"}</div>
                <div className="metric-sub">vs. ₹{loanAmount} Cr requested</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Interest Rate</div>
                <div className="metric-value amber">{recommendation?.suggestedRate || "10.25% p.a."}</div>
                <div className="metric-sub">Benchmark + 285bps spread</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Decision</div>
                <div className={`metric-value ${decisionColor}`} style={{ fontSize: "1rem", lineHeight: "1.2", paddingTop: "0.2rem" }}>{recommendation?.decision || "Conditional"}</div>
                <div className="metric-sub">Subject to conditions</div>
              </div>
            </div>

            <div className="sub-tabs">
              {["Risk Analysis", "SWOT", "Secondary Research", "Recommendation", "CAM Report"].map((t, i) => (
                <button key={t} className={`sub-tab ${subTab3 === i ? "active" : ""}`} onClick={() => setSubTab3(i)}>{t}</button>
              ))}
            </div>

            {/* Risk Analysis */}
            {subTab3 === 0 && (
              <div className="fade-in analysis-layout">
                <div className="card">
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>Risk Score Matrix</div>
                  {Object.entries(RISK_SCORES).map(([key, score]) => {
                    const cls = getRiskClass(score);
                    const label = key.replace(/Risk$/, " Risk").replace(/([A-Z])/g, " $1").trim();
                    return (
                      <div key={key} className="risk-bar-row">
                        <span className="risk-label">{label}</span>
                        <div className="risk-bar-track">
                          <div className={`risk-bar-fill ${cls}`} style={{ width: `${score}%` }} />
                        </div>
                        <span className={`risk-score ${cls}`}>{score}</span>
                      </div>
                    );
                  })}
                  <div className="alert-box">
                    <div className="alert-title">⚠ Watchlist Alert — Elevated Promoter Risk</div>
                    <div className="alert-text">ED inquiry into promoter group's overseas entities is currently sub-judice. SFIO examining ₹280 Cr related-party transactions. Credit committee to note enhanced monitoring requirement. Promoter risk score elevated to 62 — above amber threshold of 55.</div>
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>Financial Signal Review</div>
                  {FINANCIAL_SIGNALS.map(sig => (
                    <div key={sig.label} className="signal-row">
                      <span className="signal-label">{sig.label}</span>
                      <span className="signal-value" style={{ color: sig.color }}>{sig.value}</span>
                      <span className="signal-note">{sig.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SWOT */}
            {subTab3 === 1 && swot && (
              <div className="fade-in swot-grid">
                <div className="swot-quad">
                  <div className="swot-title" style={{ color: "var(--green)" }}>▲ STRENGTHS</div>
                  {swot.strengths?.map((s: string, i: number) => <div key={i} className="swot-item" style={{ borderLeftColor: "var(--green)" }}>{s}</div>)}
                </div>
                <div className="swot-quad">
                  <div className="swot-title" style={{ color: "var(--red)" }}>▼ WEAKNESSES</div>
                  {swot.weaknesses?.map((s: string, i: number) => <div key={i} className="swot-item" style={{ borderLeftColor: "var(--red)" }}>{s}</div>)}
                </div>
                <div className="swot-quad">
                  <div className="swot-title" style={{ color: "var(--cyan)" }}>◇ OPPORTUNITIES</div>
                  {swot.opportunities?.map((s: string, i: number) => <div key={i} className="swot-item" style={{ borderLeftColor: "var(--cyan)" }}>{s}</div>)}
                </div>
                <div className="swot-quad">
                  <div className="swot-title" style={{ color: "var(--amber)" }}>⚑ THREATS</div>
                  {swot.threats?.map((s: string, i: number) => <div key={i} className="swot-item" style={{ borderLeftColor: "var(--amber)" }}>{s}</div>)}
                </div>
              </div>
            )}

            {/* Secondary Research */}
            {subTab3 === 2 && (
              <div className="fade-in card">
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>News & Intelligence Signals</div>
                {NEWS_ITEMS.map((item, i) => (
                  <div key={i} className="news-item">
                    <div className="news-dot" style={{ background: item.dot }} />
                    <div className="news-text">{item.text}</div>
                    <div className="news-sentiment" style={{ color: item.sentimentColor }}>{item.sentiment}</div>
                  </div>
                ))}
                <div className="triangulation-box">
                  <div className="triangulation-title">◈ Secondary Research Triangulation — Rate Impact</div>
                  <div className="triangulation-text">Secondary research signals have been weighted against primary financial data. The ED inquiry (HIGH severity — negative) and NPA uptick (MEDIUM — negative) have together contributed a +25bps risk premium adjustment to the base rate recommendation, moving from 10.00% to 10.25% p.a. The co-lending arrangement news (POSITIVE) partially offset the adjustment by improving our assessment of the borrower's institutional relationships and regulatory standing. Net secondary research impact: +25bps on recommended pricing.</div>
                </div>
              </div>
            )}

            {/* Recommendation */}
            {subTab3 === 3 && recommendation && (
              <div className="fade-in">
                <div className={`decision-box ${decisionColor}`}>
                  <div className="decision-header">
                    <div>
                      <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Credit Committee Decision</div>
                      <div className={`decision-title`} style={{ color: decisionColor === "amber" ? "var(--amber)" : decisionColor === "green" ? "var(--green)" : "var(--red)" }}>
                        {recommendation.decision}
                      </div>
                    </div>
                    <span className={`badge ${decisionColor === "amber" ? "badge-amber" : decisionColor === "green" ? "badge-green" : "badge-red"}`}>
                      {decisionColor.toUpperCase()}
                    </span>
                  </div>
                  <div className="decision-stats">
                    <div className="decision-stat">
                      <div className="decision-stat-label">Composite Score</div>
                      <div className="decision-stat-value">{recommendation.compositeScore}/100</div>
                    </div>
                    <div className="decision-stat">
                      <div className="decision-stat-label">Sanctioned Limit</div>
                      <div className="decision-stat-value">{recommendation.suggestedAmount}</div>
                    </div>
                    <div className="decision-stat">
                      <div className="decision-stat-label">Pricing</div>
                      <div className="decision-stat-value">{recommendation.suggestedRate}</div>
                    </div>
                  </div>
                </div>

                <div className="reasoning-box">
                  <div className="reasoning-title">⬡ Reasoning Engine Output</div>
                  <div className="reasoning-text">{recommendation.reasoning}</div>
                </div>

                <div className="card">
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>Sanction Conditions</div>
                  <ol className="conditions-list">
                    {recommendation.conditions?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                  </ol>
                </div>
              </div>
            )}

            {/* CAM Report */}
            {subTab3 === 4 && (
              <div className="fade-in card-gold">
                <div className="cam-header">
                  <div className="cam-title-block">
                    <div className="cam-entity-name">{companyName}</div>
                    <div className="cam-meta">Credit Appraisal Memorandum · {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span className="badge badge-red">CONFIDENTIAL</span>
                    <button className="btn btn-outline-gold" onClick={downloadCam}>↓ Download CAM</button>
                  </div>
                </div>

                <div className="five-c-grid">
                  {FIVE_CS.map(c => (
                    <div key={c.label} className="five-c-item">
                      <div className="five-c-icon">{c.icon}</div>
                      <div className="five-c-label">{c.label}</div>
                    </div>
                  ))}
                </div>

                <div className="cam-text-box">{camReport || "Generating CAM report..."}</div>

                <div className="cam-disclaimer">
                  This Credit Appraisal Memorandum is generated by IntelliCredit AI for evaluation purposes only. It does not constitute a formal sanction or binding commitment. All decisions are subject to credit committee approval, regulatory compliance, and due diligence verification. For internal use only.
                </div>
              </div>
            )}

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back to Classification</button>
              <button className="btn btn-primary" onClick={resetAll}>+ New Assessment</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
