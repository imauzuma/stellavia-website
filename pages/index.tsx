import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const PREFECTURE_DATA = [
  { name: '北海道', latitude: 43.0642, longitude: 141.3469 },
  { name: '青森県', latitude: 40.8244, longitude: 140.7400 },
  { name: '岩手県', latitude: 39.7036, longitude: 141.1527 },
  { name: '宮城県', latitude: 38.2688, longitude: 140.8721 },
  { name: '秋田県', latitude: 39.7186, longitude: 140.1024 },
  { name: '山形県', latitude: 38.2404, longitude: 140.3633 },
  { name: '福島県', latitude: 37.7500, longitude: 140.4678 },
  { name: '茨城県', latitude: 36.3418, longitude: 140.4467 },
  { name: '栃木県', latitude: 36.5657, longitude: 139.8836 },
  { name: '群馬県', latitude: 36.3911, longitude: 139.0608 },
  { name: '埼玉県', latitude: 35.8569, longitude: 139.6489 },
  { name: '千葉県', latitude: 35.6073, longitude: 140.1063 },
  { name: '東京都', latitude: 35.6895, longitude: 139.6917 },
  { name: '神奈川県', latitude: 35.4475, longitude: 139.6425 },
  { name: '新潟県', latitude: 37.9024, longitude: 139.0236 },
  { name: '富山県', latitude: 36.6953, longitude: 137.2113 },
  { name: '石川県', latitude: 36.5946, longitude: 136.6256 },
  { name: '福井県', latitude: 36.0652, longitude: 136.2219 },
  { name: '山梨県', latitude: 35.6641, longitude: 138.5684 },
  { name: '長野県', latitude: 36.6513, longitude: 138.1812 },
  { name: '岐阜県', latitude: 35.3911, longitude: 136.7220 },
  { name: '静岡県', latitude: 34.9769, longitude: 138.3831 },
  { name: '愛知県', latitude: 35.1802, longitude: 136.9066 },
  { name: '三重県', latitude: 34.7303, longitude: 136.5086 },
  { name: '滋賀県', latitude: 35.0045, longitude: 135.8686 },
  { name: '京都府', latitude: 35.0116, longitude: 135.7681 },
  { name: '大阪府', latitude: 34.6937, longitude: 135.5023 },
  { name: '兵庫県', latitude: 34.6913, longitude: 135.1830 },
  { name: '奈良県', latitude: 34.6851, longitude: 135.8050 },
  { name: '和歌山県', latitude: 34.2261, longitude: 135.1675 },
  { name: '鳥取県', latitude: 35.5039, longitude: 134.2381 },
  { name: '島根県', latitude: 35.4723, longitude: 133.0505 },
  { name: '岡山県', latitude: 34.6618, longitude: 133.9344 },
  { name: '広島県', latitude: 34.3966, longitude: 132.4596 },
  { name: '山口県', latitude: 34.1859, longitude: 131.4706 },
  { name: '徳島県', latitude: 34.0658, longitude: 134.5593 },
  { name: '香川県', latitude: 34.3401, longitude: 134.0434 },
  { name: '愛媛県', latitude: 33.8416, longitude: 132.7661 },
  { name: '高知県', latitude: 33.5597, longitude: 133.5311 },
  { name: '福岡県', latitude: 33.6064, longitude: 130.4183 },
  { name: '佐賀県', latitude: 33.2494, longitude: 130.2988 },
  { name: '長崎県', latitude: 32.7448, longitude: 129.8737 },
  { name: '熊本県', latitude: 32.7898, longitude: 130.7417 },
  { name: '大分県', latitude: 33.2382, longitude: 131.6125 },
  { name: '宮崎県', latitude: 31.9111, longitude: 131.4239 },
  { name: '鹿児島県', latitude: 31.5602, longitude: 130.5581 },
  { name: '沖縄県', latitude: 26.2124, longitude: 127.6809 }
];

const TOKYO_INDEX = PREFECTURE_DATA.findIndex(pref => pref.name === '東京都');

const JST_TIMEZONE_OFFSET = 9;

export default function Home() {
  const [formData, setFormData] = useState({
    nickname: '',
    birthdate: '',
    birthplace: '東京都',
    birthtime: '',
    gender: 'male'
  });
  
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null as string | null,
    result: null as any
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null, result: null });

    try {
      const birthTime = formData.birthtime || '12:00';
      
      const selectedPrefecture = PREFECTURE_DATA.find(pref => pref.name === formData.birthplace) || 
                                PREFECTURE_DATA[TOKYO_INDEX];
      
      const requestData = {
        birthDate: formData.birthdate,
        birthTime: birthTime,
        latitude: selectedPrefecture.latitude,
        longitude: selectedPrefecture.longitude,
        timezoneOffset: JST_TIMEZONE_OFFSET
      };

      console.log('Sending request to API:', requestData);

      const response = await fetch('https://stellavia-horoscope-api.onrender.com/api/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '診断処理中にエラーが発生しました');
      }

      const result = await response.json();
      
      console.log('API Response:', result);
      
      setFormStatus({
        loading: false,
        success: true,
        error: null,
        result
      });
    } catch (error) {
      console.error('API Error:', error);
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
                <label htmlFor="nickname">ニックネーム（任意）</label>
                <input 
                  type="text" 
                  id="nickname" 
                  name="nickname" 
                  value={formData.nickname}
                  onChange={handleInputChange}
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
                <label htmlFor="birthplace">出生地（都道府県）</label>
                <select
                  id="birthplace"
                  name="birthplace"
                  value={formData.birthplace}
                  onChange={handleInputChange}
                  required
                  className="prefecture-select"
                >
                  {PREFECTURE_DATA.map((prefecture) => (
                    <option key={prefecture.name} value={prefecture.name}>
                      {prefecture.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="birthtime">出生時間（任意、未入力時は12:00）</label>
                <input 
                  type="time" 
                  id="birthtime" 
                  name="birthtime" 
                  value={formData.birthtime}
                  onChange={handleInputChange}
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
                    <p>APIからのレスポンスデータがコンソールに出力されました。</p>
                    <p>ブラウザの開発者ツール（F12）を開いて、コンソールタブで確認してください。</p>
                    <pre className="api-response-preview">
                      {JSON.stringify(formStatus.result, null, 2).substring(0, 300)}...
                    </pre>
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
