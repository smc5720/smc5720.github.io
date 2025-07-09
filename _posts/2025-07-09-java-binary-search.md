---
title: "Java 이진 탐색 (Binary Search) 완벽 가이드"
date: 2025-07-09 00:00:00 +0900
categories: [Java, 알고리즘]
tags: [이진 탐색, Binary Search, 정렬, 탐색 알고리즘]
---

이진 탐색(Binary Search)은 정렬된 배열에서 원하는 값을 빠르게 찾는 탐색 알고리즘입니다. 탐색 대상의 중간 값을 기준으로 좌우 절반으로 탐색 범위를 줄여가는 방식으로, 시간 복잡도는 `O(log N)`입니다.

## 개념 정리
- 전제 조건: **배열이 정렬되어 있어야 함**
- 탐색 범위를 `left`, `right` 포인터로 지정하고, `mid`를 기준으로 비교하여 탐색 범위 좁힘
- 정답을 찾거나 조건을 만족하는 인덱스를 찾는 데 주로 사용

## 주요 특징 또는 핵심 포인트
- `O(log N)` 시간 복잡도
- 정렬된 배열에서만 사용 가능
- 조건 만족 여부 기반의 lower/upper bound 구현 가능

## 사례 또는 사용 예시
### 1. 정수 탐색
```java
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

### 2. 조건 만족 인덱스 탐색 (최솟값/최댓값 경계)
```java
int lowerBound(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = (left + right) / 2;
        if (arr[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}
```

## 장점과 한계 또는 고려사항
### 장점
- 빠른 탐색 속도
- 정답 존재 여부와 관계없이 조건을 만족하는 위치 찾기에 유용

### 한계 / 단점 / 주의사항
- 배열이 정렬되어 있어야 함
- 인덱스 계산 시 `int mid = left + (right - left) / 2` 형태로 오버플로우 주의

## 실무 적용 팁 또는 마무리
- 이진 탐색은 `Collections.binarySearch()`, `Arrays.binarySearch()` 등의 Java 표준 라이브러리도 제공합니다.
- 문제 해결 시 **정렬 → 이진 탐색**의 조합은 매우 강력합니다.

---

> 💡 "이진 탐색은 정렬된 배열에서 빠르게 답을 찾아내는 가장 강력한 탐색 도구입니다!"
