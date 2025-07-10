---
title: "위상 정렬(Topological Sort) 정리"
date: 2025-07-10 00:00:00 +0900
categories: [Algorithm, Graph]
tags: [Topological Sort, 위상 정렬, 그래프, DAG, 알고리즘]
---

**위상 정렬(Topological Sort)** 은 방향 비순환 그래프(DAG, Directed Acyclic Graph)의 정점들을 순서대로 나열하는 방법입니다. 작업 간의 선후 관계가 존재하는 경우(예: 프로젝트 일정, 컴파일 종속성 등)에 매우 유용하게 사용됩니다.

## 개념 정리
- **위상 정렬**: 방향 그래프에서 노드 간의 선후 관계를 고려해 모든 노드를 순서대로 나열하는 정렬 방법.
- **DAG (Directed Acyclic Graph)**: 방향성이 있으면서 사이클이 존재하지 않는 그래프. 위상 정렬은 DAG에서만 가능.
- **선수 조건(Dependency)**: 특정 작업이 수행되기 전에 완료되어야 하는 작업.

## 주요 특징 또는 핵심 포인트
- 위상 정렬은 **하나 이상의 순서**가 존재할 수 있음.
- 사이클이 존재하면 위상 정렬이 불가능.
- **큐(BFS 기반)** 또는 **재귀(DFS 기반)** 방식으로 구현 가능.
- 시간 복잡도는 O(V + E) (V: 정점 수, E: 간선 수)

## 사례 또는 사용 예시
### 1. BFS (진입 차수 이용한 위상 정렬)
```python
from collections import deque

def topological_sort(graph):
    indegree = [0] * len(graph)
    for node in graph:
        for adj in graph[node]:
            indegree[adj] += 1

    queue = deque([i for i in range(len(graph)) if indegree[i] == 0])
    result = []

    while queue:
        current = queue.popleft()
        result.append(current)
        for adj in graph[current]:
            indegree[adj] -= 1
            if indegree[adj] == 0:
                queue.append(adj)

    return result
```

- 참고: [Baekjoon 2252 - 줄 세우기](https://www.acmicpc.net/problem/2252)

### 2. DFS 기반 위상 정렬 (스택 사용)
```python
def dfs_topo(graph):
    visited = [False] * len(graph)
    stack = []

    def dfs(node):
        visited[node] = True
        for adj in graph[node]:
            if not visited[adj]:
                dfs(adj)
        stack.append(node)

    for i in range(len(graph)):
        if not visited[i]:
            dfs(i)

    return stack[::-1]
```

## 장점과 한계 또는 고려사항
### 장점
- 작업/과제 스케줄링, 빌드 순서 계산 등 실무에 활용도가 높음
- 선후 관계를 자동으로 정리해주는 알고리즘적 장점

### 한계 / 단점 / 주의사항
- **사이클이 존재하면 위상 정렬 불가**
- 하나의 유일한 정답이 아닌 여러 가능한 순서 존재
- 구현 시 진입 차수 계산 또는 재귀 깊이에 주의 필요

## 실무 적용 팁 또는 마무리
- **컴파일러 빌드 순서 결정**, **과목 선수 조건 검사**, **CI/CD 작업 순서 자동화**, **그래프 기반 워크플로우 엔진** 등에서 활용 가능
- 사이클 검출이 필요한 경우 위상 정렬 도중 큐가 비고도 노드가 남아 있다면 사이클 존재로 판단 가능
- DFS 기반 위상 정렬은 스택의 역순으로 결과 도출

---

> 💡 위상 정렬은 DAG에서 선후 관계를 자동 정리할 수 있는 강력한 도구입니다.
