---
title: "Java DFS & BFS 알고리즘 완전 정복"
date: 2025-07-09 00:00:00 +0900
categories: [Java, 알고리즘]
tags: [DFS, BFS, 그래프 탐색, 재귀, Queue]
---

DFS(깊이 우선 탐색)과 BFS(너비 우선 탐색)는 그래프 또는 트리를 탐색하는 대표적인 알고리즘입니다. 서로 다른 방식의 순회 구조를 갖고 있으며, 문제 유형에 따라 적절한 알고리즘을 선택해야 합니다.

## 개념 정리
- **DFS**: 한 경로를 끝까지 탐색한 뒤, 다른 경로를 탐색 (스택 or 재귀)
- **BFS**: 현재 노드와 인접한 노드를 먼저 탐색 (큐 사용)
- 그래프, 트리, 2차원 배열 탐색 등 다양한 문제에서 활용

## 주요 특징 또는 핵심 포인트
- DFS는 **재귀 또는 Stack**, BFS는 **Queue**를 사용
- DFS는 경로, 순열, 백트래킹 문제에 유리
- BFS는 최단 거리 탐색에 유리

## 사례 또는 사용 예시
### 1. DFS (재귀)
```java
void dfs(int v, boolean[] visited, List<List<Integer>> graph) {
    visited[v] = true;
    for (int next : graph.get(v)) {
        if (!visited[next]) {
            dfs(next, visited, graph);
        }
    }
}
```

### 2. BFS (큐)
```java
void bfs(int start, boolean[] visited, List<List<Integer>> graph) {
    Queue<Integer> q = new LinkedList<>();
    q.offer(start);
    visited[start] = true;

    while (!q.isEmpty()) {
        int cur = q.poll();
        for (int next : graph.get(cur)) {
            if (!visited[next]) {
                visited[next] = true;
                q.offer(next);
            }
        }
    }
}
```

## 장점과 한계 또는 고려사항
### 장점
- DFS: 경로 추적, 백트래킹에 유리
- BFS: 최단 거리 계산에 최적

### 한계 / 단점 / 주의사항
- DFS: 스택 오버플로우 주의 (재귀 깊이)
- BFS: 큐 공간 소모가 클 수 있음

## 실무 적용 팁 또는 마무리
- 트리/그래프 탐색 문제는 **DFS/BFS로 접근하는 패턴을 익히는 것**이 중요합니다.
- Queue/Stack 사용을 명확히 구분하고, 방문 배열을 꼭 체크하세요.

---

> 💡 "DFS는 깊게, BFS는 넓게! 상황에 맞게 골라 쓰는 것이 핵심입니다."
