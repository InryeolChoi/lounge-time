# Lounge Time 🛋️

직장인을 위한 **3분 휴식** 웹 애플리케이션

화면 중앙의 아이스크림을 누르고 있는 동안 휴식 시간이 실시간으로 흐릅니다.
화면 전체는 "카페에 앉아 창밖을 바라보거나, 실내 폭포 조경을 마주한" 1인칭 몰입 씬으로
구성되며, 진행도에 따라 카페/폭포 테마의 배경이 부드럽게 바뀌고, Web Audio 앰비언스와
익명 라운지 채팅이 "온라인 라운지에 들어온 느낌"을 만들어 줍니다.

---

## ✨ 주요 기능

- 🍦 **아이스크림 인터랙션** — 클릭·탭·키보드(Space/Enter)로 휴식을 시작·일시정지(토글). 진행에 따라 실시간으로 녹아 줄어들고, 남은 시간을 카운트다운으로 표시
- 🪟 **1인칭 몰입 씬** — 앉아서 카페 창밖(산 풍경·펜던트 조명·원목 테이블) 또는 실내 폭포 조경(흐르는 물줄기·수반 물결)을 바라보는 시점. 순수 CSS 레이어로 깊이감을 만들고, 전경의 아이스크림을 살짝 내려다보는 원근으로 표현
- 🎨 **동적 테마** — 산 카페 / 폭포 테마, 진행도에 따라 그라데이션 변화 (설정 저장)
- 🎵 **앰비언스 사운드** — 오디오 파일 없이 Web Audio API 로 테마별 사운드 생성 (설정 저장)
- 💬 **익명 라운지 채팅** — Spring Boot 백엔드와 연동, 백엔드가 없으면 localStorage 로 자동 폴백. 내 메시지 강조·빈 상태 안내
- 📊 **휴식 추적** — 휴식 완료 시 누적 카운트 증가(중복 증가 없음)
- ♿ **접근성** — 키보드 토글, `:focus-visible` 포커스 표시, `prefers-reduced-motion` 대응

---

## 🧱 기술 스택

| 구분 | 스택 |
|------|------|
| Frontend | React 18 · TypeScript · Vite · 순수 CSS · Vitest |
| Backend | **Java 22** · Spring Boot 3.3 · Gradle |
| 저장 | 백엔드 in-memory + 브라우저 localStorage 폴백 |
| 배포 | 프론트엔드: Azure Static Web Apps · 백엔드: 임의의 JVM 호스트 |

---

## 📁 프로젝트 구조

```
.
├── CLAUDE.md                # AI/기여자용 아키텍처·컨벤션 가이드
├── index.html               # Vite 진입 HTML
├── package.json
├── vite.config.ts           # /api → :8080 dev 프록시
├── public/                  # favicon 등 정적 자산
├── src/
│   ├── App.tsx              # 화면 조립
│   ├── components/          # Header, Scene(몰입 씬), IceCream, ChatPanel ...
│   ├── hooks/               # useRestTimer, useAmbientSound, usePersistentState
│   ├── services/            # chatApi (백엔드 통신 + 폴백)
│   ├── types/               # 공용 타입
│   ├── utils/               # time 등 순수 로직(+ Vitest 테스트)
│   └── styles/              # App.css, Scene.css
└── backend/                 # Spring Boot (Java 22, Gradle)
    ├── build.gradle
    └── src/main/java/com/loungetime/
        ├── controller/      # ChatController, StatsController
        ├── service/         # ChatService, StatsService
        ├── model/           # Message (record)
        └── config/          # CORS
```

---

## 🚀 실행 방법

### 사전 요구사항
- Node.js 18+ / npm
- JDK 22 (백엔드 실행 시. Gradle 은 wrapper 포함이라 별도 설치 불필요)

### 1) 프론트엔드

```bash
npm install
npm run dev        # http://localhost:3000
```

### 2) 백엔드 (선택 — 없어도 프론트는 단독 동작)

```bash
cd backend
./gradlew bootRun  # http://localhost:8080
```

dev 모드에서는 Vite 가 `/api` 요청을 `http://localhost:8080` 으로 프록시합니다.

### 3) 프로덕션 빌드

```bash
npm run build              # 타입검사 + dist/ 생성
cd backend && ./gradlew build   # jar + 테스트
```

---

## 🔌 API

기본 경로 `/api` (dev 에서는 Vite 프록시).

| Method | Path               | 설명                              | 본문 |
|--------|--------------------|-----------------------------------|------|
| GET    | `/api/messages`    | 채팅 메시지 목록                  | —    |
| POST   | `/api/messages`    | 메시지 추가 (201)                 | `{ "user": "You_1", "text": "..." }` |
| GET    | `/api/stats`       | 누적 휴식 완료 수                 | —    |
| POST   | `/api/stats/rest`  | 휴식 완료 1회 기록                | —    |

예시:

```bash
curl http://localhost:8080/api/messages
curl -X POST http://localhost:8080/api/messages \
  -H 'Content-Type: application/json' \
  -d '{"user":"You_42","text":"안녕하세요"}'
```

> `text` 는 필수이며 최대 100자입니다. 비어 있으면 `400` 을 반환합니다.

---

## 🧪 검증

```bash
npm run typecheck                 # 프론트엔드 타입 검사
npm test                          # 프론트엔드 단위 테스트 (Vitest)
npm run build                     # 프론트엔드 빌드
cd backend && ./gradlew build     # 백엔드 컴파일 + 테스트
```

---

## 🧭 설계 메모

- 핵심 메커니즘은 클릭/탭/키보드로 시작·일시정지하는 3분 휴식입니다(타임스탬프 기반, 드리프트 없음).
- 백엔드가 없어도 프론트엔드가 단독으로 동작하도록 모든 통신에 localStorage 폴백을 둡니다.
- 자세한 아키텍처·컨벤션·개선 이력은 [`CLAUDE.md`](./CLAUDE.md) 를 참고하세요.

---

## 📈 향후 개선 아이디어

- [ ] 메시지 영속화(DB) 및 다중 인스턴스 지원
- [ ] 추가 테마(바다, 도서관 등)
- [ ] 통계 대시보드 / 사용자 설정 저장
- [ ] PWA · 다국어 지원
- [ ] 백엔드 컨테이너화 및 배포 파이프라인

---

## 라이선스

MIT

---

**Lounge Time** — 당신의 휴식 시간을 더 특별하게 🛋️☕
