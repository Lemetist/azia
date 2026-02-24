"use client";

const heroImage = 'https://www.figma.com/api/mcp/asset/bfafd760-8aa9-44c6-acff-afd08a00c360';
const featureImgTall = 'https://www.figma.com/api/mcp/asset/7c2e4795-0557-46d0-92b7-9172ef487f7e';
const featureImgWideTop = 'https://www.figma.com/api/mcp/asset/a88d7b51-52b0-44be-b8e1-4e890346b6f4';
const featureImgWideBottom = 'https://www.figma.com/api/mcp/asset/5403ade4-773f-4a34-a814-3ee6db1ab371';
const iconStart = 'https://www.figma.com/api/mcp/asset/dbc81489-6c7b-4ec1-abcd-53898428c82a';
const iconAnywhere = 'https://www.figma.com/api/mcp/asset/6af52e33-953c-43c1-8316-88fee2122b53';
const iconProgress = 'https://www.figma.com/api/mcp/asset/926d105d-5cb8-434d-99c5-e91bee87863a';
const coachImgs = [
  'https://www.figma.com/api/mcp/asset/cfa781cf-61d8-4995-8ef5-751a6d768bf7',
  'https://www.figma.com/api/mcp/asset/4b1549fb-44f5-4a8f-b8d5-bb3d2a4d2e43',
  'https://www.figma.com/api/mcp/asset/a2d5b714-bae9-41ef-8974-c1e115153ebe',
  'https://www.figma.com/api/mcp/asset/2a5f6da9-916c-4528-81a2-5ed968b38c14',
  'https://www.figma.com/api/mcp/asset/3eafbaf0-b232-4e28-91d6-c3403f57fb1b',
  'https://www.figma.com/api/mcp/asset/ded48ff4-7a2a-47e6-94d7-7be6ac6c9cea',
];
const footerBg = 'https://www.figma.com/api/mcp/asset/86711c1e-7edc-4fa5-a3cf-d07d89bc0e01';

const reasons = [
  {
    title: 'Начни тренироваться сегодня',
    description:
      'Помогает пользователю сделать первый шаг: выбрать цель, уровень и получить персональный план занятий',
    icon: iconStart,
  },
  {
    title: 'Тренируйся где и когда удобно',
    description:
      'Отслеживание тренировок, сожжённых калорий, шагов и времени активности в удобной статистике.',
    icon: iconAnywhere,
  },
  {
    title: 'Твой прогресс в одном месте',
    description:
      'Отслеживание тренировок, сожжённых калорий, шагов и времени активности в удобной статистике.',
    icon: iconProgress,
  },
];

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <img src={heroImage} alt="Боксер с обмотанными руками" className="heroImage" />
        <div className="heroOverlay" />
        <div className="heroHeadline">HARD WORK PAYS.</div>
      </section>

      <section className="section" id="why">
        <div className="sectionInner">
          <div className="sectionHeader">
            <h2>Почему стоит выбрать нас?</h2>
            <p>
              Физические упражнения — это любая активность, при которой работают мышцы и организм тратит
              энергию (сжигает калории).
            </p>
          </div>
          <div className="whyGrid">
            <div className="reasonList">
              {reasons.map((item) => (
                <article key={item.title} className="reason">
                  <div className="iconWrap">
                    <img src={item.icon} alt="" aria-hidden className="icon" />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="whyImages">
              <div className="whyTall">
                <img src={featureImgTall} alt="Тренировка на скакалке" />
              </div>
              <div className="whyStack">
                <img src={featureImgWideTop} alt="Растяжка в зале" />
                <img src={featureImgWideBottom} alt="Девушка делает жим ногами" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section coaches" id="coaches">
        <div className="sectionInner">
          <div className="sectionHeader">
            <h2>Познакомьтесь с нашими тренерами</h2>
          </div>
          <div className="coachGrid">
            {coachImgs.map((src, idx) => (
              <div key={src + idx} className="coachCard">
                <img src={src} alt="Тренер" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footerBg">
          <img src={footerBg} alt="Фон спортзала" />
          <div className="footerOverlay" />
        </div>
        <div className="footerContent">
          <p>Позвоните нам прямо сейчас</p>
          <h3>+Phone</h3>
        </div>
        <p className="footerNote">© 2026</p>
      </footer>

      <style jsx>{`
        .page {
          background: radial-gradient(circle at 20% 20%, rgba(0, 0, 0, 0.04), transparent 22%),
            radial-gradient(circle at 80% 0%, rgba(0, 0, 0, 0.03), transparent 24%),
            #f5f5f5;
          color: #424242;
          min-height: 100vh;
        }

        .hero {
          position: relative;
          height: 720px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .heroImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
        }

        .hero::after {
          content: '';
          position: absolute;
          inset: auto 0 0;
          height: 180px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(245, 245, 245, 1) 100%);
          pointer-events: none;
        }

        .heroHeadline {
          position: relative;
          font-size: clamp(26px, 4vw, 42px);
          letter-spacing: 0.18em;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.94);
          color: #222;
          text-align: center;
          border-radius: 6px;
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.25);
        }

        .section {
          padding: 96px 24px;
        }

        .sectionInner {
          max-width: 1180px;
          margin: 0 auto;
        }

        .sectionHeader {
          text-align: center;
          margin-bottom: 52px;
        }

        .section h2 {
          font-size: clamp(30px, 3vw, 36px);
          font-weight: 700;
          margin: 0;
          position: relative;
          display: inline-block;
          padding-bottom: 14px;
        }

        .section h2::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 68px;
          height: 4px;
          background: #424242;
          border-radius: 999px;
          transform: translateX(-50%);
        }

        .sectionHeader p {
          margin: 18px auto 0;
          max-width: 720px;
          font-size: 18px;
          line-height: 1.45;
          color: #7a7a7a;
        }

        .whyGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .reasonList {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .reason {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 18px;
          align-items: flex-start;
          background: #fff;
          padding: 14px 16px;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(58, 53, 65, 0.12);
        }

        .iconWrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #424242;
          display: grid;
          place-items: center;
        }

        .icon {
          width: 26px;
          height: 26px;
        }

        .reason h3 {
          margin: 0 0 6px;
          font-size: 22px;
          font-weight: 600;
        }

        .reason p {
          margin: 0;
          color: #7a7a7a;
          line-height: 1.5;
        }

        .whyImages {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          align-items: center;
        }

        .whyTall img,
        .whyStack img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(58, 53, 65, 0.2);
        }

        .whyTall {
          height: 410px;
        }

        .whyStack {
          display: grid;
          gap: 18px;
        }

        .whyStack img:first-child {
          height: 196px;
        }

        .whyStack img:last-child {
          height: 196px;
        }

        .coaches .sectionHeader {
          margin-bottom: 36px;
        }

        .coachGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 18px;
        }

        .coachCard img {
          width: 100%;
          height: 230px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(58, 53, 65, 0.16);
        }

        .footer {
          position: relative;
          background: #0f0f0f;
          color: #fff;
          padding: 90px 24px 32px;
          text-align: center;
          overflow: hidden;
          margin-top: 20px;
        }

        .footerBg img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .footerOverlay {
          position: absolute;
          inset: 0;
          background: rgba(17, 17, 17, 0.68);
        }

        .footerBg {
          position: absolute;
          inset: 0;
        }

        .footerContent {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }

        .footerContent p {
          margin: 0;
          font-size: 20px;
          letter-spacing: 0.2px;
        }

        .footerContent h3 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }

        .footerNote {
          position: relative;
          margin: 42px 0 0;
          font-size: 14px;
          color: #dcdcdc;
        }

        @media (max-width: 1040px) {
          .hero {
            height: 600px;
          }

          .whyGrid {
            grid-template-columns: 1fr;
          }

          .whyImages {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .section {
            padding: 72px 18px;
          }

          .reason {
            grid-template-columns: auto 1fr;
          }

          .heroHeadline {
            font-size: 20px;
            padding: 12px 18px;
          }

          .whyTall,
          .whyStack img:first-child,
          .whyStack img:last-child {
            height: auto;
          }
        }
      `}</style>
    </main>
  );
}
