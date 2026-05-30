'use client'

export default function DepthScroll() {
  return (
    <div className="ds-root">
      <style>{`
        .ds-root {
          height: 100vh;
          overflow-y: scroll;
          position: relative;
          overscroll-behavior: contain;
        }
        .ds-spacer {
          height: 500vh;
          position: relative;
        }
        .ds-pin {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .ds-section {
          position: absolute;
          inset: 0;
          perspective: 1200px;
          animation: ds-pointer linear both;
          animation-duration: auto;
          animation-timeline: scroll(block nearest);
          animation-range: var(--ds-event-range);
        }
        .ds-section *:not(:empty) {
          transform-style: preserve-3d;
        }
        @keyframes ds-pointer {
          0%, 100% { pointer-events: none; }
          25%, 75% { pointer-events: all; }
        }
        .ds-section:nth-child(1) { --ds-color: hsl(0 75% 75%);   --ds-range: 0% 40%;    --ds-event-range: 10% 30%;   z-index: 5; }
        .ds-section:nth-child(2) { --ds-color: hsl(72 75% 75%);  --ds-range: 20% 60%;   --ds-event-range: 30% 50%;   z-index: 4; }
        .ds-section:nth-child(3) { --ds-color: hsl(144 75% 75%); --ds-range: 40% 80%;   --ds-event-range: 50% 70%;   z-index: 3; }
        .ds-section:nth-child(4) { --ds-color: hsl(216 75% 75%); --ds-range: 60% 100%;  --ds-event-range: 70% 90%;   z-index: 2; }
        .ds-section:nth-child(5) { --ds-color: hsl(288 75% 75%); --ds-range: 80% 120%;  --ds-event-range: 90% 110%;  z-index: 1; }

        .ds-content {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 1rem;
          background-color: var(--ds-color);
          background-image:
            repeating-linear-gradient(#fff3 0 2px, transparent 0 40px),
            repeating-linear-gradient(90deg, #fff3 0 2px, transparent 0 40px);
          transform-origin: 50% 50% 50vmin;
          padding: 2em;
          font-size: clamp(14px, 2vw, 22px);
          overflow-y: auto;
          color: #111;
          animation: ds-content cubic-bezier(0,0,0,1) both;
          animation-duration: auto;
          animation-timeline: scroll(block nearest);
          animation-range: var(--ds-range);
        }
        .ds-top .ds-content {
          animation-name: ds-top-content;
        }
        @keyframes ds-top-content {
          0%   { transform: translateZ(-12000px) rotateX(60deg) rotateZ(110deg); opacity: 1; animation-timing-function: ease-out; }
          50%  { transform: translateZ(0px) rotateX(0deg) rotateZ(0deg); opacity: 1; animation-timing-function: cubic-bezier(1,0,1,1); }
          100% { transform: translateZ(1200px); opacity: 0; }
        }
        @keyframes ds-content {
          0%   { transform: translateZ(-12000px); opacity: 0; }
          50%  { transform: translateZ(0px); opacity: 1; animation-timing-function: cubic-bezier(1,0,1,1); }
          100% { transform: translateZ(1200px); opacity: 0; }
        }

        .ds-content h1 { font-size: 2.2em; font-weight: 900; max-width: 40rem; width: 100%; }
        .ds-content h2 { font-size: 2em; font-weight: 900; max-width: 40rem; width: 100%; }
        .ds-content h2.ds-center { text-align: center; }
        .ds-content p { max-width: 40rem; line-height: 1.6; }

        .ds-cube {
          position: absolute;
          inset: 0;
          transform-origin: 50% 50% 50vmin;
          pointer-events: none;
          animation: ds-cube ease-out forwards;
          animation-duration: auto;
          animation-timeline: scroll(block nearest);
          animation-range: 0% 20%;
        }
        @keyframes ds-cube {
          from { transform: translateZ(-12000px) rotateX(60deg) rotateZ(110deg); }
          to   { transform: translateZ(0px) rotateX(0deg) rotateZ(0deg); }
        }
        .ds-cube > div {
          position: absolute;
          background-color: rgba(255, 200, 255, 0.5);
          box-shadow: 0 0 50px #000 inset;
        }
        .ds-cube > div:nth-child(1) { left: 0;   top: 0;    width: 100vmin; height: 100%;    transform: rotateY(-90deg);  transform-origin: left;   }
        .ds-cube > div:nth-child(2) { right: 0;  top: 0;    width: 100vmin; height: 100%;    transform: rotateY(90deg);   transform-origin: right;  }
        .ds-cube > div:nth-child(3) { left: 0;   top: 0;    width: 100%;    height: 100vmin; transform: rotateX(90deg);   transform-origin: top;    }
        .ds-cube > div:nth-child(4) { left: 0;   bottom: 0; width: 100%;    height: 100vmin; transform: rotateX(-90deg);  transform-origin: bottom; }

        .ds-btns { display: flex; gap: 1em; margin-top: 0.5em; flex-wrap: wrap; }
        .ds-btns button {
          font-size: inherit;
          padding: 0.5em 1.2em;
          background: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.15s, color 0.15s;
        }
        .ds-btns button:hover  { background: #ffd6e0; }
        .ds-btns button:active { background: #7C3AED; color: #fff; }

        .ds-list {
          overscroll-behavior: contain;
          background: rgba(255,255,255,0.5);
          margin-top: 0.5em;
          padding: 1em;
          max-height: 220px;
          overflow-y: scroll;
          max-width: 40rem;
          width: 100%;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.6em;
          font-size: 0.8em;
        }
        .ds-list p { max-width: none; }
      `}</style>

      <div className="ds-spacer">
        <div className="ds-pin">

          {/* Section 1 — with spinning cube */}
          <section className="ds-section ds-top">
            <div className="ds-content">
              <h1>Think. Plan. Grow.</h1>
              <p>WeThink delivers end-to-end digital transformation — turning your vision into scalable, high-impact technology solutions.</p>
            </div>
            <div className="ds-cube">
              <div /><div /><div /><div />
            </div>
          </section>

          {/* Section 2 */}
          <section className="ds-section">
            <div className="ds-content">
              <h2>Strategy</h2>
              <p>We craft data-driven digital strategies tailored to your business. Every decision is backed by research, market insight, and years of consulting expertise.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="ds-section">
            <div className="ds-content">
              <h2>Build</h2>
              <p>From web applications to enterprise platforms, our team ships clean, performant software that scales with your growth.</p>
              <div className="ds-btns">
                <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start a Project
                </button>
                <button onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}>
                  Our Services
                </button>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="ds-section">
            <div className="ds-content">
              <h2>Innovate</h2>
              <p>We harness AI, cloud, and emerging technology to future-proof your business — so you stay ahead, not behind.</p>
              <div className="ds-list">
                <p>✦ Artificial Intelligence & Machine Learning</p>
                <p>✦ Cloud Architecture & Migration</p>
                <p>✦ Cybersecurity & Compliance</p>
                <p>✦ Custom Software Development</p>
                <p>✦ Digital Product Design & UX</p>
                <p>✦ Data Analytics & Business Intelligence</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="ds-section">
            <div className="ds-content">
              <h2 className="ds-center">5+ years · 5000+ projects · 1000+ clients<br/>Ready to be next? 🚀</h2>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
