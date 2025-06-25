# 🌊 snapTide Frontend

**snapTide Frontend**는 사진 기반 SNS 애플리케이션의 프론트엔드 클라이언트입니다. React와 TypeScript로 구축되었으며, REST API 백엔드와 연동하여 피드 등록/조회/수정/삭제 및 사용자 인증(회원가입, 로그인)을 제공합니다.

---

## 🛠️ 기술 스택

- **React 18+**
- **TypeScript**
- **React Router**
- **Bootstrap / Tailwind CSS**
- **JWT 기반 인증 처리**
- **REST API 연동**
- **Fetch API 기반 비동기 처리**

---

## 🚀 주요 기능

| 기능 | 설명 |
|------|------|
| 🧾 피드 목록 | 피드 검색, 페이징, 썸네일 표시 |
| ➕ 피드 작성 | 사진 업로드 포함, 등록 폼 |
| 🔍 피드 상세 | 리뷰 수, 좋아요, 이미지 포함 |
| ✏️ 피드 수정 | 이미지 추가/삭제 및 제목 수정 |
| 🧑‍💻 회원가입 | 이메일/비밀번호 기반 신규 가입 |
| 🔐 로그인 | JWT 토큰 기반 로그인 및 세션 저장 |

---

## 🔑 인증 흐름

| 기능 | 설명 |
|------|------|
| `/login` | 사용자 로그인 요청 → 서버에서 JWT 토큰 발급 |
| `/join` | 이메일/비밀번호로 신규 회원가입 |
| `useToken()` | 토큰을 sessionStorage에서 가져와 API 요청에 활용 |
| `useAuth()` | 인증 컨텍스트 관리 (로그인 후 라우팅 포함)

---

## 📁 주요 라우팅

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/feeds/list` | `List.tsx` | 피드 리스트 및 검색 |
| `/feeds/register` | `Register.tsx` | 새 피드 작성 |
| `/feeds/read?fno=1` | `Read.tsx` | 피드 상세 보기 |
| `/feeds/modify/:fno` | `Modify.tsx` | 피드 수정 |
| `/login` | `Login.tsx` | 사용자 로그인 |
| `/join` | `Join.tsx` | 사용자 회원가입 |

---

## 🧪 핵심 컴포넌트 설명

### `Login.tsx`
- 이메일/비밀번호 입력 후 `/api/auth/login` 요청
- 성공 시 `sessionStorage`에 토큰 저장 및 `/feeds/list`로 이동:contentReference[oaicite:0]{index=0}

### `Join.tsx`
- 이메일/비밀번호 입력 폼 UI
- (백엔드 연동은 추후 구현 필요로 보임):contentReference[oaicite:1]{index=1}

---

## 🖼️ UI 캡처 예시 (옵션)

```markdown
![Login 화면](./docs/login.png)
![피드 목록](./docs/feed-list.png)
````
---

## ⚙️ 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

### 3. 접속 주소

```bash
http://localhost:3000
```

> 🔁 `localhost:8080`에서 백엔드 서버도 함께 실행 중이어야 정상 작동합니다.

---

## 💡 향후 개선 포인트

* [ ] 회원가입 API 연동
* [ ] 로그인 실패/성공 피드백 개선
* [ ] Route Guard 적용 (비인증 사용자 차단)
* [ ] 댓글 기능 추가
* [ ] 반응형 UI 개선

## ✅ 1. 프론트/백 서버 배포용 Dockerfile

### 🔧 `snapTide API` (백엔드) - `Dockerfile`

```Dockerfile
# Backend Dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY target/snapTide-api.jar app.jar

# 포트 노출
EXPOSE 8080

# 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 📂 백엔드 docker-compose.yml 예시

```yaml
version: '3'
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    depends_on:
      - db

  db:
    image: mysql:8.0
    container_name: snaptide-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: snaptide
      MYSQL_USER: user
      MYSQL_PASSWORD: pass
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

---

### 🌐 `snapTide Frontend` - `Dockerfile`

```Dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# serve를 통해 정적 파일 서비스
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000
```

---

## ✅ 2. 전체 폴더 구조 시각화 예시

```plaintext
snapTide/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── target/snapTide-api.jar
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Join.tsx
│   │   │   ├── List.tsx
│   │   │   ├── Read.tsx
│   │   │   ├── Modify.tsx
│   │   │   └── Register.tsx
│   │   └── hooks/
│   │       └── useToken.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## ✅ 3. `.env.example` (프론트용)

```env
# .env.example for snapTide Frontend

# 백엔드 API 서버 주소
REACT_APP_API_BASE=http://localhost:8080

# 기본 포트
PORT=3000

# 개발 모드
NODE_ENV=development
```

> 실제 `.env` 파일은 `.gitignore`에 포함되어야 합니다.

---

