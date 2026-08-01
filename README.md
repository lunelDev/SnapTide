# 🌊 SnapTide

사진 기반 **소셜 플랫폼 (SNS)** 으로, 사용자가 사진을 공유하고 댓글을 통해 소통할 수 있는 풀스택 웹 애플리케이션입니다.  
Spring Boot 기반 REST API 서버와 React(TypeScript) 클라이언트로 구성되었습니다.  

이 프로젝트는 **회원 인증 → 피드 CRUD → 이미지 업로드 → 검색/필터링 → 반응형 UI**까지 웹 서비스의 전 과정을 직접 구현한 개인 포트폴리오용 프로젝트입니다.

## 내가 개발한 부분

이 프로젝트는 **개인 프로젝트**로, 서버(Spring Boot)와 클라이언트(React) 전 과정을 직접 구현했습니다.

* **Backend**

  * JWT 기반 회원 인증/인가 (Spring Security)
  * 피드 CRUD API + 페이징 처리
  * 다중 이미지 업로드/삭제 (MultipartFile, UUID 기반 파일 관리)
  * 리뷰(댓글) CRUD 기능
  * 전역 예외 처리 (ControllerAdvice)

* **Frontend**

  * 로그인/회원가입 UI + 토큰 관리(sessionStorage)
  * 피드 등록/수정/삭제/조회 화면 + 이미지 업로드 기능
  * 키워드 검색, 카테고리 필터링, 페이징 처리
  * 반응형 UI (Bootstrap + Tailwind CSS)
  * Fetch API 기반 서버 연동

## 학습 포인트 & 성과

* Spring Security와 JWT를 활용한 **인증/인가 전 과정을 직접 구현**
* **REST API 설계부터 React 클라이언트 연동까지 엔드투엔드 개발 경험**
* 다중 이미지 업로드와 페이징, 예외 처리 등 **실무 서비스에 가까운 기능 구현**
* MariaDB·JPA 기반 데이터 모델링과 이미지 파일 저장 처리 경험

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| **Backend** | Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security (JWT), MariaDB, Maven |
| **Frontend** | React 18+, TypeScript, React Router, Bootstrap / Tailwind CSS, Fetch API, JWT 인증 |
| **Tools** | IntelliJ, VS Code, Git |

## 🚀 주요 기능

| 구분 | 기능 |
|------|------|
| 회원 관리 | 회원 가입, 로그인, 권한(Role) 관리 |
| 인증 처리 | JWT 토큰 기반 인증/인가, 세션 유지 |
| 피드 관리 | 피드 등록, 수정, 삭제, 조회, 페이징 처리 |
| 리뷰 관리 | 피드·사진에 대한 리뷰 CRUD |
| 사진 업로드 | Multipart 파일 업로드 및 URL 반환 |
| UI/UX | 반응형 디자인, 사진 목록·검색·필터링 |
| 예외 처리 | ControllerAdvice 기반 전역 예외 처리 |

## 🧱 ERD 다이어그램
```text
Members (회원, 테이블명 m_members)
 ├── mid (PK)
 ├── email / pw / nickname / name
 ├── fromSocial (소셜 로그인 여부)
 └── roleSet (@ElementCollection) ──▶ MembersRole { USER, MANAGER, ADMIN }

Feeds (피드 = 게시글)
 ├── fno (PK)
 ├── title
 └── regDate / modDate (BasicEntity 상속, JPA Auditing 자동 기록)

Photos (사진)
 ├── pnum (PK)
 ├── uuid / photosName / path
 └── feeds (FK) ──▶ Feeds         # 하나의 피드에 다중 사진 (N:1)

Reviews (리뷰 = 별점 + 한줄평)
 ├── reviewsnum (PK)
 ├── likes (별점) / text (한줄평)
 ├── feeds (FK)   ──▶ Feeds       # 피드별 리뷰 (N:1)
 └── members (FK) ──▶ Members     # 작성자 (N:1)
````
## 📂 프로젝트 구조

```plaintext
SnapTide/
├── API/SnapTideAPI/               # Spring Boot API 서버
│   ├── src/main/java/com/example/api/
│   │   ├── controller/  service/  repository/   # 3-Layer 아키텍처
│   │   ├── entity/  dto/                         # 도메인 모델 · 전송 객체
│   │   ├── security/  config/                    # JWT 인증 · 시큐리티 설정
│   │   └── ApiApplication.java
│   ├── src/main/resources/application.properties
│   ├── .env.example                             # 환경변수 예시
│   └── pom.xml
│
├── insta_front/                   # React 클라이언트 (Vite + TypeScript)
│   ├── src/pages/
│   │   ├── members/               # Login.tsx, Join.tsx
│   │   └── feeds/                 # List.tsx, Read.tsx, Register.tsx, Modify.tsx
│   ├── src/contexts/  hooks/  routes/  utils/
│   └── package.json
│
└── README.md
```
## 📘 Frontend 라우팅

* **주요 라우팅**

  | 경로                   | 설명          |
  | -------------------- | ----------- |
  | `/feeds/list`        | 피드 리스트 및 검색 |
  | `/feeds/register`    | 새 피드 작성     |
  | `/feeds/read?fno=1`  | 피드 상세 보기    |
  | `/feeds/modify/:fno` | 피드 수정       |
  | `/login`             | 사용자 로그인     |
  | `/join`              | 회원가입        |

## ⚙️ 실행 방법 (로컬 · MariaDB 필요)

> DB 접속 정보와 JWT 시크릿은 소스에 하드코딩하지 않고 **환경변수로 주입**합니다.
> `API/SnapTideAPI/.env.example` 을 참고해 값을 채운 뒤 실행하세요.

#### 1) DB 준비 (MariaDB)

```sql
CREATE DATABASE db7;
CREATE USER 'db7'@'localhost' IDENTIFIED BY '<your-password>';
GRANT ALL PRIVILEGES ON db7.* TO 'db7'@'localhost';
```

#### 2) Backend (Spring Boot)

```bash
cd API/SnapTideAPI

# 환경변수 주입 (예시)
export DB_PASSWORD='<your-password>'
export JWT_SECRET='최소 32자 이상의 무작위 문자열'

./mvnw spring-boot:run
```

> 테이블은 `spring.jpa.hibernate.ddl-auto=update` 설정으로 최초 실행 시 자동 생성됩니다.
> 업로드 파일은 기본적으로 `<사용자 홈>/snaptide-uploads` 에 저장됩니다 (`UPLOAD_PATH` 로 변경 가능).

#### 3) Frontend (React + Vite)

```bash
cd insta_front
npm install
npm run dev
```
## 📸 주요 화면 (UI 캡처)

| 기능 | 화면 1 | 화면 2 | 화면 3 |
|------|--------|--------|--------|
| **회원 인증** | <img src="Screenshots/그림3.png" width="200" height="300"/><br/>로그인 페이지 | <img src="Screenshots/그림47.png" width="200" height="300"/><br/>로그인 성공 → 메인 이동 | <img src="Screenshots/그림1.png" width="200" height="300"/><br/>유효성 검사 |
| **피드 등록 & 목록** | <img src="Screenshots/그림29.png" width="200" height="300"/><br/>게시글 등록 | <img src="Screenshots/그림30.png" width="200" height="300"/><br/>이미지 없는 등록 | <img src="Screenshots/그림43.png" width="200" height="300"/><br/>다중 이미지 등록 |
| **피드 조회 & 수정/삭제** | <img src="Screenshots/그림34.png" width="200" height="300"/><br/>게시글 상세 | <img src="Screenshots/그림45.png" width="200" height="300"/><br/>게시글 수정 | <img src="Screenshots/그림44.png" width="200" height="300"/><br/>게시글 삭제 |
| **검색 & 필터링** | <img src="Screenshots/그림40.png" width="200" height="300"/><br/>카테고리 필터링 | <img src="Screenshots/그림25.png" width="200" height="300"/><br/>키워드 검색 | <img src="Screenshots/그림26.png" width="200" height="300"/><br/>검색 결과 |
| **피드 상세 & 수정 완료** | <img src="Screenshots/그림31.png" width="200" height="300"/><br/>READ 화면 | <img src="Screenshots/그림35.png" width="200" height="300"/><br/>수정 완료 | <img src="Screenshots/그림33.png" width="200" height="300"/><br/>이미지 없는 등록 |
| **반응형 페이지** | <img src="Screenshots/그림41.png" width="200" height="300"/><br/>991px 이하 화면 | <img src="Screenshots/그림24.png" width="200" height="300"/><br/>피드 리스트 & 페이징 | <img src="Screenshots/그림40.png" width="200" height="300"/><br/>검색·필터링 지원 |

## 🔮 향후 개선 방향

* AWS S3 연동을 통한 이미지 업로드 클라우드화
* WebSocket 기반 실시간 알림(Notification) 기능 추가
* Docker·GitHub Actions 기반 CI/CD 배포 파이프라인 구축 (향후)
* 반응형 UI 개선 및 모바일 최적화 강화

