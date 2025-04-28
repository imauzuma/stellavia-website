import React, { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  const [formData, setFormData] = useState({
    nickname: '',
    birthdate: '',
    birthplace: '',
    birthtime: '',
    gender: 'male'
  });
  
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null as string | null,
    result: null as any
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null, result: null });

    try {
      const response = await fetch('/api/stellavia/chart-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '診断処理中にエラーが発生しました');
      }

      const result = await response.json();
      setFormStatus({
        loading: false,
        success: true,
        error: null,
        result
      });
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : '診断処理中にエラーが発生しました',
        result: null
      });
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="logo">Stellavia</div>
          <nav className="main-nav">
            <ul>
              <li><a href="#brand">ブランド紹介</a></li>
              <li><a href="#service">サービス</a></li>
              <li><a href="#diagnosis">診断</a></li>
              <li><a href="#contact">お問い合わせ</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero" id="hero">
        <div className="hero-content">
          <h1>あなたの魂の旅を、星とともに</h1>
          <p>Stellavia - 魂の進化を導く占星体験</p>
          <a href="#brand" className="btn-primary">詳しく見る</a>
        </div>
      </section>

      <section className="brand" id="brand">
        <div className="container">
          <h2>Stellaviaの使命</h2>
          <div className="brand-content">
            <div className="brand-text">
              <p>Stellaviaは、魂の進化をサポートする占星術の新しいアプローチを提供します。私たちの目的は、単なる占いを超え、自己探求と成長のためのツールとして占星術を活用することです。</p>
              <p>星と自己の繋がりを通じて、あなた自身の内なる宇宙を探索し、真の可能性を解き放ちましょう。</p>
            </div>
            <div className="brand-image">
              <div className="cosmic-circle"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="service" id="service">
        <div className="container">
          <h2>魂の進化セッション体験</h2>
          <div className="service-content">
            <div className="service-item">
              <div className="service-icon">
                <div className="star-icon"></div>
              </div>
              <h3>星と自己の繋がりを探る</h3>
              <p>あなたの生まれ持った星の配置から、魂の目的と可能性を紐解きます。宇宙の神秘と個人の意識を結びつけるセッションです。</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <div className="moon-icon"></div>
              </div>
              <h3>内なる月のリズムを知る</h3>
              <p>感情の流れと直感力を司る月のエネルギーと調和し、心の平安と感情的な成長を促進します。</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <div className="planet-icon"></div>
              </div>
              <h3>魂の進化のプロセス</h3>
              <p>過去世からの学びと未来への展望を占星術を通して探求し、現在の人生における成長の機会を発見します。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="diagnosis" id="diagnosis">
        <div className="container">
          <h2>進化占星術 簡易診断</h2>
          <p className="diagnosis-intro">あなたの生年月日と出生地から、星の配置を分析し、魂の進化の道筋を探ります。以下のフォームに情報を入力してください。</p>
          
          <div className="diagnosis-form-container">
            <form className="diagnosis-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nickname">ニックネーム</label>
                <input 
                  type="text" 
                  id="nickname" 
                  name="nickname" 
                  value={formData.nickname}
                  onChange={handleInputChange}
                  required 
                  placeholder="あなたのニックネーム"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="birthdate">生年月日</label>
                <input 
                  type="date" 
                  id="birthdate" 
                  name="birthdate" 
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="birthplace">出生地</label>
                <input 
                  type="text" 
                  id="birthplace" 
                  name="birthplace" 
                  value={formData.birthplace}
                  onChange={handleInputChange}
                  required 
                  placeholder="例: 東京都新宿区"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="birthtime">出生時間</label>
                <input 
                  type="text" 
                  id="birthtime" 
                  name="birthtime" 
                  value={formData.birthtime}
                  onChange={handleInputChange}
                  required 
                  placeholder="例: 12:00"
                  pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                />
              </div>
              
              <div className="form-group">
                <label>性別</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="male" 
                      checked={formData.gender === 'male'}
                      onChange={handleInputChange}
                      required 
                    />
                    <span>男性</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="female" 
                      checked={formData.gender === 'female'}
                      onChange={handleInputChange}
                    />
                    <span>女性</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="other" 
                      checked={formData.gender === 'other'}
                      onChange={handleInputChange}
                    />
                    <span>その他</span>
                  </label>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn-diagnosis"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? '診断中...' : '診断する'}
              </button>
            </form>
            
            {formStatus.error && (
              <div className="diagnosis-error">
                <p>{formStatus.error}</p>
              </div>
            )}
            
            {formStatus.success && formStatus.result && (
              <div className="diagnosis-result">
                <h3>診断結果</h3>
                <div className="result-content">
                  <p>あなたの星の配置から、以下の特徴が読み取れます：</p>
                  <div className="planet-positions">
                    <h4>主要天体の位置</h4>
                    <ul>
                      {Object.entries(formStatus.result.planetPositions).map(([planet, position]: [string, any]) => (
                        <li key={planet}>
                          <strong>{planet}:</strong> {position.sign} {position.degree}°
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="aspects">
                    <h4>重要なアスペクト</h4>
                    <ul>
                      {formStatus.result.aspects.map((aspect: any, index: number) => (
                        <li key={index}>
                          {aspect.planet1} - {aspect.planet2}: {aspect.type} ({aspect.orb}°)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <h2>お問い合わせ</h2>
          <p className="contact-intro">Stellaviaの世界観に触れる最初の一歩を踏み出しませんか？ご質問やセッションのご予約は下記からお気軽にお問い合わせください。</p>
          <div className="contact-form">
            <a href="mailto:contact@stellavia.com" className="btn-contact">メールでのお問い合わせ</a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">Stellavia</div>
            <p className="copyright">© 2025 Stellavia. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Google Places API script for future implementation */}
      {/*
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"
        strategy="lazyOnload"
      />
      */}
    </>
  );
}
