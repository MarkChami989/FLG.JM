import { useNavigate } from 'react-router-dom'
import Header from '../src/components/Header.jsx'
import './lounge.css'

function Lounge() {
  const navigate = useNavigate()

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>
      <div className="orb orb4"></div><div className="orb orb5"></div>

      <Header active="lounge" />

      <main>
        <div className="page-hero">
          <div className="page-tag">Relax · Sip · Enjoy</div>
          <div className="page-title">CIGAR LOUNGE</div>
          <div className="page-line"></div>
        </div>

        <div className="grid">

          <div className="card">
            <div className="card-glow"></div>
            <div className="corner tl"></div><div className="corner tr"></div>
            <div className="corner bl"></div><div className="corner br"></div>

            <div className="c-visual">
              <div className="bar-scene">
                <div className="bar-ambient"></div>
                <div className="bar-lights">
                  {Array.from({ length: 8 }).map((_, i) => <div className="bar-light" key={i}></div>)}
                </div>

                <div className="bar-shelf" style={{ top: 14 }}>
                  <div className="shelf-items">
                    {['b1', 'b2', 'b3', 'b4', 'b5', 'b6'].map((b) => (
                      <div className={`bottle ${b}`} key={b}>
                        <div className="bottle-neck"></div>
                        <div className="bottle-body"><div className="bottle-label"></div><div className="bottle-shine"></div><div className="bottle-glow"></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="shelf-board"></div>
                </div>

                <div className="bar-shelf" style={{ top: 108 }}>
                  <div className="shelf-items">
                    <div className="bottle b6"><div className="bottle-neck" style={{ height: 12 }}></div><div className="bottle-body" style={{ height: 44, width: 20 }}><div className="bottle-label"></div><div className="bottle-shine"></div><div className="bottle-glow"></div></div></div>
                    <div className="bottle b1"><div className="bottle-neck" style={{ height: 10 }}></div><div className="bottle-body" style={{ height: 40, width: 18 }}><div className="bottle-label"></div><div className="bottle-shine"></div><div className="bottle-glow"></div></div></div>
                    <div className="bottle b4"><div className="bottle-neck" style={{ height: 16 }}></div><div className="bottle-body" style={{ height: 48, width: 19 }}><div className="bottle-label"></div><div className="bottle-shine"></div><div className="bottle-glow"></div></div></div>
                    <div className="bottle b3"><div className="bottle-neck" style={{ height: 14 }}></div><div className="bottle-body" style={{ height: 44, width: 17 }}><div className="bottle-label"></div><div className="bottle-shine"></div><div className="bottle-glow"></div></div></div>
                    <div className="bottle b2"><div className="bottle-neck" style={{ height: 18 }}></div><div className="bottle-body" style={{ height: 50, width: 19 }}><div className="bottle-label"></div><div className="bottle-shine"></div><div className="bottle-glow"></div></div></div>
                  </div>
                  <div className="shelf-board"></div>
                </div>

                <div className="smoke">
                  <div className="wisp wisp1">💨</div>
                  <div className="wisp wisp2">💨</div>
                  <div className="wisp wisp3">💨</div>
                </div>

                <div className="bar-counter">
                  <div className="counter-item">🥂</div>
                  <div className="counter-item">🍸</div>
                  <div className="counter-item">🥃</div>
                  <div className="counter-item">🍹</div>
                  <div className="counter-item">🍫</div>
                  <div className="counter-glow"></div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="c-title">🥂 The Bar</div>
              <div className="c-desc">A curated selection of premium spirits, champagnes, and signature cocktails. Our expert bartenders craft every drink to perfection in an intimate luxury setting.</div>

              <div className="menu-list">
                <div className="menu-item">
                  <div className="menu-left"><div className="menu-emoji">🥃</div><div><div className="menu-name">Macallan 18 Y.O.</div><div className="menu-sub">Single Malt Scotch · Scotland</div></div></div>
                  <div className="menu-price">$38</div>
                </div>
                <div className="menu-item">
                  <div className="menu-left"><div className="menu-emoji">🥂</div><div><div className="menu-name">Dom Pérignon 2015</div><div className="menu-sub">Vintage Champagne · France</div></div></div>
                  <div className="menu-price">$45</div>
                </div>
                <div className="menu-item">
                  <div className="menu-left"><div className="menu-emoji">🍸</div><div><div className="menu-name">Signature Negroni</div><div className="menu-sub">Gin · Campari · Sweet Vermouth</div></div></div>
                  <div className="menu-price">$22</div>
                </div>
              </div>

              <div className="avail-row">
                <div className="av-chip av-open"><div className="av-dot"></div> Open Now</div>
                <div className="av-chip av-gold">🕐 Until 3AM</div>
                <div className="av-chip av-pink">18+ Only</div>
              </div>

              <button className="btn-reserve" onClick={() => navigate('/reserve')}>🥃 &nbsp; Reserve Now</button>
            </div>
          </div>

          <div className="card">
            <div className="card-glow"></div>
            <div className="corner tl"></div><div className="corner tr"></div>
            <div className="corner bl"></div><div className="corner br"></div>

            <div className="c-visual">
              <div className="table-scene">
                <div className="table-ambient"></div>
                <div className="chair l">🪑</div>
                <div style={{ position: 'relative' }}>
                  <div className="candle-wrap">
                    <div className="candle-flame">🕯️</div>
                  </div>
                  <div className="lounge-table">
                    <div className="table-surface-shine"></div>
                    <div className="t-whiskey">🥃</div>
                    <div className="t-glass">🍫</div>
                    <div className="t-cigar">🚬</div>
                    <div className="t-ashtray">🎫</div>
                    <div className="table-leg l"></div>
                    <div className="table-leg r"></div>
                  </div>
                </div>
                <div className="chair r">🪑</div>
                <div className="table-badge">TABLE VIP</div>
              </div>
            </div>

            <div className="card-body">
              <div className="c-title">🛋️ Lounge Table</div>
              <div className="c-desc">Reserve your private lounge table for an exclusive evening. Enjoy premium cigars, fine spirits, and luxury seating in a fully private ambiance with personal service.</div>

              <div className="menu-list">
                <div className="menu-item">
                  <div className="menu-left"><div className="menu-emoji">🚬</div><div><div className="menu-name">Cohiba Behike 52</div><div className="menu-sub">Premium Cigar · Cuba</div></div></div>
                  <div className="menu-price">$28</div>
                </div>
                <div className="menu-item">
                  <div className="menu-left"><div className="menu-emoji">🧀</div><div><div className="menu-name">Artisan Platter</div><div className="menu-sub">Cheese · Charcuterie · Truffle</div></div></div>
                  <div className="menu-price">$35</div>
                </div>
                <div className="menu-item">
                  <div className="menu-left"><div className="menu-emoji">☕</div><div><div className="menu-name">Arabic Coffee Service</div><div className="menu-sub">Premium Blend · Dates included</div></div></div>
                  <div className="menu-price">$18</div>
                </div>
              </div>

              <div className="avail-row">
                <div className="av-chip av-open"><div className="av-dot"></div> Available</div>
                <div className="av-chip av-gold">👑 VIP Table</div>
                <div className="av-chip av-pink">🪑 2–6 Guests</div>
              </div>

              <button className="btn-reserve" onClick={() => navigate('/reserve-table')}>🛋️ &nbsp; Reserve Now</button>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default Lounge
