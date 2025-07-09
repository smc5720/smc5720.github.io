---
title: "Java 우선순위 큐(PriorityQueue) 완전 정복"
date: 2025-07-09 00:00:00 +0900
categories: [Java, 자료구조]
tags: [PriorityQueue, 우선순위 큐, 정렬 큐, 힙]
---

Java에서 `PriorityQueue`는 기본 자료구조 중 하나로, 우선순위에 따라 요소를 자동으로 정렬해주는 큐입니다. 주로 최솟값이나 최댓값을 빠르게 꺼내야 하는 문제에 자주 사용됩니다. 코딩테스트에서도 빈번하게 등장하는 만큼, 잘 이해하고 있어야 합니다.

## 개념 정리
- **PriorityQueue**: 우선순위에 따라 정렬된 상태로 요소를 저장하고, 가장 높은 우선순위를 가진 요소를 가장 먼저 꺼냄.
- **힙(Heap)** 자료구조 기반으로 동작하며, 내부적으로 최소 힙(Min-Heap)으로 구현됨.
- **Comparator**를 이용해 최대 힙(Max-Heap) 등 사용자 정의 정렬 가능.

## 주요 특징 또는 핵심 포인트
- 기본은 **최소 힙(Min-Heap)** 구조 (`peek()` 시 가장 작은 값 반환)
- `O(log N)`의 삽입 및 삭제 시간 복잡도
- `poll()`, `peek()`, `offer()` 등의 메서드로 사용
- 객체에 대해 정렬 기준을 정의하고 사용할 수 있음

## 사례 또는 사용 예시
### 1. 기본 사용 예시 (정수)
```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();

        pq.offer(3);
        pq.offer(1);
        pq.offer(2);

        while (!pq.isEmpty()) {
            System.out.println(pq.poll()); // 1, 2, 3 순서로 출력
        }
    }
}
```

### 2. 최대 힙 (내림차순 정렬)
```java
PriorityQueue<Integer> maxPq = new PriorityQueue<>(Collections.reverseOrder());
maxPq.offer(10);
maxPq.offer(5);
maxPq.offer(20);

while (!maxPq.isEmpty()) {
    System.out.println(maxPq.poll()); // 20, 10, 5
}
```

### 3. 사용자 정의 객체 정렬
```java
class Task {
    int priority;
    String name;

    public Task(int priority, String name) {
        this.priority = priority;
        this.name = name;
    }
}

PriorityQueue<Task> taskQueue = new PriorityQueue<>(Comparator.comparingInt(t -> t.priority));
taskQueue.offer(new Task(2, "Write"));
taskQueue.offer(new Task(1, "Read"));

while (!taskQueue.isEmpty()) {
    System.out.println(taskQueue.poll().name); // Read, Write
}
```

## 장점과 한계 또는 고려사항
### 장점
- 정렬된 순서 유지 필요 없이 효율적으로 최댓값/최솟값 추출
- 실시간 데이터 처리에 적합 (예: 실시간 랭킹, K개 중 최댓값 유지 등)

### 한계 / 단점 / 주의사항
- 중간 요소 접근이 불가능함 (`get(i)` 불가)
- 정렬된 전체 순회가 필요할 경우에는 `List` + `Collections.sort()`가 적절할 수 있음
- `remove()` 메서드는 선형 시간복잡도 (`O(N)`)

## 실무 적용 팁 또는 마무리
- 코딩테스트에서는 기본적으로 `PriorityQueue<Integer>` 혹은 `PriorityQueue<int[]>` 형태가 자주 등장합니다.
- 사용자 정의 객체를 다룰 때는 반드시 `Comparator` 또는 `Comparable`을 정의해야 합니다.
- 최대 힙 구현은 `Collections.reverseOrder()` 또는 음수 값 저장 방식으로 가능.

---

> 💡 "우선순위 큐는 정렬을 최소화하면서도 우선순위 처리를 가능하게 해주는 강력한 도구입니다!"
