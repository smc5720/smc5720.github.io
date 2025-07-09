---
title: "Java 기초 자료구조: 스택, 큐, 해시, 힙, 트리"
date: 2025-07-09 00:00:00 +0900
categories: [Java, 자료구조]
tags: [스택, 큐, 해시맵, 힙, 트리]
---

기초 자료구조는 알고리즘 문제 해결의 기반입니다. Java에서 제공하는 기본 라이브러리를 활용해 다양한 구조를 손쉽게 구현할 수 있으며, 각 자료구조는 적절한 상황에서 유용하게 사용됩니다.

## 개념 정리
- **Stack**: 후입선출 (LIFO)
- **Queue**: 선입선출 (FIFO)
- **HashMap/HashSet**: 키 기반 저장, 빠른 탐색
- **PriorityQueue(Heap)**: 우선순위 기반 정렬 큐
- **Tree**: 계층적 구조, DFS/BFS 탐색 대상

## 주요 특징 또는 핵심 포인트
- Stack: `push`, `pop`, `peek` 메서드 사용
- Queue: `offer`, `poll`, `peek` 메서드
- HashMap: 키/값 저장 및 조회 (`O(1)` 접근)
- Heap: `PriorityQueue` 사용 (기본 min-heap)
- Tree: 자식 노드가 있는 구조, 이진 트리, 트라이 등

## 사용 예시
```java
Stack<Integer> stack = new Stack<>();
Queue<Integer> queue = new LinkedList<>();
Map<String, Integer> map = new HashMap<>();
Set<Integer> set = new HashSet<>();
PriorityQueue<Integer> pq = new PriorityQueue<>();
```

## 장점과 한계 또는 고려사항
### 장점
- 시간 복잡도 개선
- 다양한 알고리즘 문제 해결의 기반

### 한계 / 단점 / 주의사항
- 자료구조의 동작 원리와 API 사용법 정확히 숙지 필요

## 실무 적용 팁 또는 마무리
- 자주 쓰이는 자료구조 API를 코드로 직접 구현해보는 연습이 중요합니다.
- 라이브러리만 쓸 줄 아는 것보다 **직접 구현 원리**를 이해하는 것이 훨씬 중요합니다.

---

> 💡 "기초 자료구조는 문제 해결의 뼈대입니다. 익숙해질수록 더 빠르게 사고할 수 있습니다."
