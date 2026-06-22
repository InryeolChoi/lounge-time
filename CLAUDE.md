# CLAUDE.md

가이드 for AI assistants (and humans) working in the **Lounge Time** repository.

---

## 1. 프로젝트 개요

**Lounge Time** 은 직장인을 위한 "3분 휴식" 웹 애플리케이션입니다.
화면 중앙의 아이스크림을 누르고 있는 동안 휴식 시간이 흐르고, 진행도에 따라
카페/폭포 테마의 배경이 부드럽게 변하며, 익명 라운지 채팅으로 온라인 라운지에
들어온 듯한 분위기를 제공합니다.

- **Frontend**: React 18 + TypeScript + Vite (저장소 루트)
- **Backend**: Java 22 + Spring Boot 3 + Gradle (`backend/` 디렉터리)
- **배포**: 프론트엔드는 Azure Static Web Apps, 백엔드는 별도 JVM 호스트

---

## 2. 리포지토리 구조

```
.
├── CLAUDE.md                # 이 파일
├── README.md
├── index.html               # Vite 진입 HTML (루트)
├── package.json             # 프론트엔드 스크립트/의존성
├── vite.config.ts           # /api → :8080 dev 프록시 포함
├── tsconfig*.json
├── public/                  # 정적 자산(favicon 등)
├── src/
│   ├── index.tsx            # React 진입점
│   ├── App.tsx              # 화면 조립(orchestration)
│   ├── components/          # 프레젠테이션 컴포넌트
│   ├── hooks/               # 커스텀 훅(타이머, 사운드 등)
│   ├── services/            # 백엔드 통신(fallback 포함)
│   ├── types/               # 공용 타입
│   └── styles/              # CSS
└── backend/                 # Spring Boot (Java 22, Gradle)
    ├── build.gradle
    ├── settings.gradle
    ├── gradlew / gradlew.bat
    └── src/main/java/com/loungetime/...
        ├── LoungeTimeApplication.java
        ├── config/          # CORS 등
        ├── controller/      # REST 엔드포인트
        ├── model/           # 도메인 레코드
        └── service/         # 비즈니스 로직(in-memory store)
```

---

## 3. 명령어 (검증된 빌드/실행)

### Frontend (루트)
```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run typecheck    # tsc --noEmit 타입 검사
npm run build        # 프로덕션 빌드 → dist/
npm run preview      # 빌드 미리보기
```

### Backend (`backend/`)
```bash
./gradlew bootRun    # 개발 서버 (http://localhost:8080)
./gradlew build      # 컴파일 + 테스트 + jar
./gradlew test       # 테스트만
```

> 백엔드는 Java 22 toolchain 을 사용합니다. Gradle wrapper 가 포함되어 있어
> 시스템 Gradle 설치는 불필요합니다.

---

## 4. 코딩 컨벤션

### TypeScript / React
- 들여쓰기 2칸, 세미콜론 필수, 작은따옴표 문자열.
- 모든 변수/함수에 타입 지정. `any` 금지.
- 컴포넌트는 작고 단일 책임으로 분리하고 `components/` 에 둔다.
- 재사용 로직은 `hooks/` 의 커스텀 훅으로 추출한다.
- 외부 UI 라이브러리(Tailwind, MUI 등) 금지 — 순수 CSS 만 사용.
- 부수효과(setInterval 등) 정리(cleanup)를 반드시 반환한다.
- 타이머 핸들 타입은 `ReturnType<typeof setInterval>` 사용(`NodeJS.Timeout` 금지).

### Java / Spring Boot
- 들여쓰기 4칸, 패키지 루트 `com.loungetime`.
- 불변 도메인은 `record` 로 표현한다.
- 컨트롤러는 얇게, 로직은 서비스에 둔다.
- 동시성 안전한 컬렉션(`CopyOnWriteArrayList`, `AtomicLong` 등) 사용.
- 모든 신규 서비스/컨트롤러에 JUnit 테스트를 추가한다.

---

## 5. 도메인 규칙 (핵심 동작)

- **휴식(rest)** 은 3분(180초) 기준. `progress = floor(elapsed / 180 * 100)`.
- 아이스크림을 **누르고 있는 동안에만** 시간이 흐른다(실시간). 떼면 일시정지.
- `progress` 가 100 에 **도달하는 순간 1회만** 휴식 완료 카운트를 올린다(중복 증가 금지).
- 채팅은 백엔드(`/api/messages`)를 우선 사용하고, 실패 시 localStorage 로 폴백한다.
- 사운드는 오디오 파일 없이 **Web Audio API** 로 생성한다(테마별 필터링 노이즈).

---

## 6. API 계약

| Method | Path                | 설명                         |
|--------|---------------------|------------------------------|
| GET    | `/api/messages`     | 채팅 메시지 목록             |
| POST   | `/api/messages`     | 메시지 추가 `{user?, text}`  |
| GET    | `/api/stats`        | 누적 휴식 완료 수            |
| POST   | `/api/stats/rest`   | 휴식 완료 1회 기록           |

응답은 JSON. dev 환경에서는 Vite 프록시가 `/api` → `http://localhost:8080` 로 전달.

---

## 7. 설계 분석 메모 (개선 이력 및 매력 포인트)

### 발견된 문제 (해결됨)
- 문서상 "누르고 있으면 줄어듦" 과 달리, 기존 코드는 **떼었을 때 +5초** 만 더하고
  별도의 항상-동작 타이머가 동시에 돌아 동작이 모순적이었다 → 실시간 hold 방식으로 통일.
- 완료 `useEffect` 가 `restCount` 에 의존해 progress≥100 구간에서 **카운트 무한 증가** →
  100 도달 시 1회만 증가하도록 수정.
- `NodeJS.Timeout` 타입 네임스페이스 오류 → `ReturnType<typeof setInterval>` 로 교체.
- `public/index.html` 이 잘못된 경로를 참조하는 **죽은 파일** → 제거.
- 사운드 토글이 아무 동작도 하지 않음 → Web Audio API 앰비언스 구현.
- 채팅이 영속화/자동 스크롤되지 않음 → 백엔드 연동 + localStorage 폴백 + 자동 스크롤.
- README 의 `npm start` 는 존재하지 않는 스크립트 → 문서 정정.

### 지켜야 할 매력 포인트
- 글래스모피즘(반투명 + blur) + 진행도에 반응하는 **동적 그라데이션 테마**.
- 아이스크림으로 휴식을 시각화하는 **은유적 인터랙션**.
- 익명 라운지 채팅이 만드는 **함께 쉬는 분위기**.

---

## 8. 작업 시 주의사항

- 프론트엔드는 루트에 유지(Azure SWA `app_location:/` 호환). 옮기지 말 것.
- 백엔드가 꺼져 있어도 프론트엔드는 단독 동작해야 한다(폴백 보장).
- 변경 후에는 반드시 `npm run typecheck && npm run build` 와
  `cd backend && ./gradlew build` 가 모두 통과하는지 확인한다.
