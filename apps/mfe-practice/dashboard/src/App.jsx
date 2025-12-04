import React, { useState } from "react";
import "./styles.css";

const PRODUCTS = [
  {
    id: 1,
    name: "플로팅 데스크 램프",
    category: "조명 / 데스크",
    price: 89000,
    unit: "개",
    summary: "야간 집중에 최적화된 소프트 라이트와 무선 충전 스탠드.",
    description:
      "장시간 작업해도 눈이 편안한 3,000–5,000K 컬러 온도 지원과 무선 충전 패드가 결합된 데스크 램프입니다. 밝기 단계 조절, 타이머 기능을 제공해 야근이 잦은 팀에도 잘 어울립니다.",
  },
  {
    id: 2,
    name: "미니 스탠딩 데스크",
    category: "워크스페이스",
    price: 219000,
    unit: "대",
    summary: "기존 책상 위에 올려 쓰는 전동 스탠딩 모듈.",
    description:
      "책상을 통째로 바꾸지 않고도 손쉽게 높낮이 조절이 가능한 전동 모듈입니다. 최대 15kg 하중을 버티며, 3단 높이 프리셋과 충돌 방지 센서를 탑재했습니다.",
  },
  {
    id: 3,
    name: "노트북 거치 허브",
    category: "액세서리",
    price: 129000,
    unit: "개",
    summary: "USB‑C 허브와 쿨링 기능이 결합된 알루미늄 스탠드.",
    description:
      "HDMI, USB‑A, USB‑C, Ethernet까지 모두 지원하는 올인원 허브입니다. 알루미늄 바디와 히트 싱크 구조로 발열을 분산해 장시간 사용에도 안정적인 성능을 유지합니다.",
  },
];

const App = () => {
  const [selected, setSelected] = useState(null);

  const handleBack = () => setSelected(null);

  if (selected) {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <button className="button-soft" onClick={handleBack}>
            ← 전체 상품으로 돌아가기
          </button>
        </header>
        <main className="dashboard-layout">
          <div className="detail-layout">
            <section className="detail-media" />
            <section className="detail-panel">
              <div className="chip">
                <span className="chip-dot" />
                <span>{selected.category}</span>
              </div>
              <h1 className="detail-title">{selected.name}</h1>
              <p className="detail-meta">
                대시보드에서 바로 재고와 판매 추이를 확인할 수 있는 추천 상품입니다.
              </p>
              <p className="detail-description">{selected.description}</p>
              <div className="detail-actions">
                <button className="button-primary">
                  장바구니에 담기
                  <span>＋</span>
                </button>
                <button className="button-soft" onClick={handleBack}>
                  다른 상품도 보기
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <div className="chip">
            <span className="chip-dot" />
            <span>실시간 카탈로그</span>
          </div>
          <h1 className="dashboard-title">상품 대시보드</h1>
          <p className="dashboard-subtitle">
            요즘 잘 팔리는 아이템들을 한 번에 확인하고, 클릭해서 상세 스펙을 살펴보세요.
          </p>
        </div>
        <button className="button-soft">
          필터·정렬
          <span>⌘F</span>
        </button>
      </header>

      <main className="dashboard-layout">
        <section className="card-grid">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="card"
              onClick={() => setSelected(product)}
            >
              <div className="card-tag">{product.category}</div>
              <h2 className="card-title">{product.name}</h2>
              <p className="card-desc">{product.summary}</p>
              <div className="card-footer">
                <div className="price">
                  ₩{product.price.toLocaleString()}
                  <span>/ {product.unit}</span>
                </div>
                <span className="button-soft">
                  상세 보기
                  <span>↗</span>
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default App;