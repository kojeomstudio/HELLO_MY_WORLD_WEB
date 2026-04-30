# 07 - 보안 (거시적 설계)

## 포팅 방향성

Minetest의 **SRP 인증 + conf 기반 보안 설정**을 **PBKDF2 해시 + CORS + 시큐리티 헤더**로 대체합니다.
웹 환경 특유의 보안 위협(XSS, CSRF)에 대한 대응을 추가합니다.

## 보안 구성도

```
┌─────────────────────────────────────────────────┐
│                    보안 계층                      │
│                                                  │
│  [네트워크]  CORS + WebSocket 전용               │
│  [인증]     PBKDF2 해시 + 브루트포스 방지         │
│  [권한]     19 권한 + 권한 상승 방지              │
│  [입력검증]  이름/채팅/위치/블록 유효성 검사       │
│  [속도제한]  액션별 쿨다운                         │
│  [안티치트]  서버 권위 물리 + 위치 보정            │
│  [콘텐츠]    HTML 엔티티 인코딩, 시큐리티 헤더     │
│  [데이터]    시크릿 미하드코딩, DB 미버전관리       │
│  [CI/CD]    시크릿 스캔, npm audit               │
└─────────────────────────────────────────────────┘
```

## 인증

| 항목 | Minetest | 웹 프로젝트 |
|------|----------|-----------|
| 방식 | SRP (Secure Remote Password) | PBKDF2 (100k iterations, SHA256) |
| 솔트 | SRP 내장 | 16바이트 랜덤 솔트/사용자 |
| 비교 | SRP 프로토콜 | constant-time 비교 |
| 레거시 | - | SHA256 해시 거부 (강제 재설정) |
| 브루트포스 | - | 5회 실패 -> 5분 잠금 |

## 권한 상승 방지

| 규칙 | 설명 |
|------|------|
| 자기 부여 금지 | 자신에게 권한 부여 불가 |
| 자기 취소 금지 | 자신의 권한 취소 불가 |
| server 권한 보호 | server 권한은 명령어로 취소 불가 |

## 안티치트 (서버 권위 물리)

```
1. 클라이언트 위치 수신
2. PhysicsEngine 검증:
   - 속도 제한 (maxSpeed * dt * 1.5)
   - 텔레포트 감지 (큰 위치 델타)
   - 충돌 검사 (고체 블록)
   - 비행 모드 일관성 (fly 권한 필요)
   - NaN/Infinity 거부
   - 월드 경계 클램핑
3. 위반 시 OnPositionCorrection 전송
4. 회전(yaw/pitch)은 클라이언트 권위
```

## 웹 특화 보안

| 위협 | 대응 |
|------|------|
| XSS | HTML 엔티티 인코딩 (채팅) |
| CSRF | SignalR WebSocket 전용 (REST 최소화) |
| CORS | `corsOrigins` 화이트리스트 |
| 콘텐츠 스니핑 | X-Content-Type-Options: nosniff |
| 클릭재킹 | X-Frame-Options: DENY |
| XSS | X-XSS-Protection: 1; mode=block |
| 시크릿 유출 | .gitignore (`.env`, `*.key`, `*.db`) |
| 취약한 의존성 | npm audit + CI 스캔 |

## 상세 구현 참조

| 주제 | 참조 문서 |
|------|---------|
| Minetest 보안 설정값 | `web/docs/reference/game-content.md` (보안 설정) |
| Minetest anticheat 플래그 | `web/docs/reference/game-content.md` (anticheat_flags) |
| Minetest 인증 흐름 | `web/docs/reference/network-protocol.md` (INIT) |
