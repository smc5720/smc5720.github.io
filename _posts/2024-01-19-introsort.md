---
title: "인트로 정렬 (Introsort) - 퀵 정렬, 힙 정렬, 삽입 정렬의 하이브리드 알고리즘"
excerpt: "인트로 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
categories:
  - Algorithm
tags:
  - Sorting
  - Introsort
  - Hybrid
  - C++
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 인트로 정렬이란?

인트로 정렬(Introsort, Introspective Sort)은 퀵 정렬, 힙 정렬, 삽입 정렬을 결합한 하이브리드 정렬 알고리즘입니다. 퀵 정렬의 평균적인 빠른 성능과 힙 정렬의 최악의 경우 O(n log n) 보장을 결합하여, 실제로 C++의 표준 라이브러리(`std::sort`) 등에서 사용됩니다.

## 알고리즘 동작 원리

1. **퀵 정렬로 시작** - 분할 정복 방식으로 정렬
2. **재귀 깊이 제한** - 재귀 깊이가 log₂n을 초과하면 힙 정렬로 전환
3. **작은 배열** - 일정 크기 이하의 배열은 삽입 정렬로 처리

## 시각적 예시

```
초기 배열: [64, 34, 25, 12, 22, 11, 90]

1단계 - 퀵 정렬로 분할:
[11, 12, 22, 25, 34, 64, 90]

2단계 - 재귀 깊이 초과 시 힙 정렬로 전환:
(분할이 비효율적일 때 힙 정렬 적용)

3단계 - 작은 배열은 삽입 정렬로 처리:
(예: 16개 이하의 배열)
```

## JavaScript 구현 (간단 버전)

```javascript
function introsort(arr) {
    const maxDepth = 2 * Math.floor(Math.log2(arr.length));
    introsortUtil(arr, 0, arr.length - 1, maxDepth);
    return arr;
}

function introsortUtil(arr, start, end, maxDepth) {
    const size = end - start + 1;
    if (size < 16) {
        insertionSort(arr, start, end);
        return;
    }
    if (maxDepth === 0) {
        heapSortPartial(arr, start, end);
        return;
    }
    const pivot = partition(arr, start, end);
    introsortUtil(arr, start, pivot - 1, maxDepth - 1);
    introsortUtil(arr, pivot + 1, end, maxDepth - 1);
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

function insertionSort(arr, left, right) {
    for (let i = left + 1; i <= right; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

function heapSortPartial(arr, start, end) {
    const n = end - start + 1;
    for (let i = Math.floor(n / 2) - 1 + start; i >= start; i--) {
        heapify(arr, n, i, start);
    }
    for (let i = end; i > start; i--) {
        [arr[start], arr[i]] = [arr[i], arr[start]];
        heapify(arr, i - start, start, start);
    }
}

function heapify(arr, n, i, offset) {
    let largest = i;
    const left = 2 * (i - offset) + 1 + offset;
    const right = 2 * (i - offset) + 2 + offset;
    if (left < n + offset && arr[left] > arr[largest]) largest = left;
    if (right < n + offset && arr[right] > arr[largest]) largest = right;
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest, offset);
    }
}

// 사용 예시
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("정렬 전:", array);
console.log("정렬 후:", introsort([...array]));
```

## Python 구현 (개념 설명)

Python 표준 라이브러리에는 직접 구현되어 있지 않지만, C++의 std::sort와 유사하게 구현할 수 있습니다.

## 성능 분석

### 시간 복잡도
- **최선/평균/최악**: O(n log n)

### 공간 복잡도
- **O(log n)** (재귀 호출 스택)

### 안정성
- **불안정 정렬** (같은 값의 순서가 바뀔 수 있음)

## 장단점

### 장점
- **퀵 정렬의 빠른 평균 성능**
- **최악의 경우에도 O(n log n) 보장**
- **작은 배열에 삽입 정렬 적용으로 효율적**
- **C++ 표준 라이브러리에서 사용**

### 단점
- **구현이 복잡**
- **안정 정렬이 아님**

## 실제 사용 사례

- **C++의 std::sort**
- **대부분의 C++ STL 컨테이너 정렬**
- **최악의 경우 성능 보장이 필요한 환경**

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 | 실제 사용 |
|---------|---------------|---------------|-----------|--------|----------|
| 인트로 정렬 | O(n log n) | O(n log n) | O(log n) | ❌ | C++ std::sort |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ | 일부 언어 |
| 병합 정렬 | O(n log n) | O(n log n) | O(n) | ✅ | 일부 언어 |
| 팀 정렬 | O(n log n) | O(n log n) | O(n) | ✅ | Python, Java |

## 결론

인트로 정렬은 퀵 정렬의 빠른 평균 성능과 힙 정렬의 최악 성능 보장을 결합한 하이브리드 정렬 알고리즘입니다. 실제로 C++ 표준 라이브러리에서 사용되며, 다양한 상황에서 안정적이고 빠른 정렬을 제공합니다.

---

**참고 자료:**
- [Introsort - GeeksforGeeks](https://www.geeksforgeeks.org/intro-sort/)
- [Introsort - Wikipedia](https://en.wikipedia.org/wiki/Introsort) 