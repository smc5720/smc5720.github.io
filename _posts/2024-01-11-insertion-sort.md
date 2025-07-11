---
title: "삽입 정렬 (Insertion Sort) - 카드 정렬처럼 하나씩 삽입하기"
excerpt: "삽입 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
description: "삽입 정렬의 개념, 동작 원리, 구현 코드, 성능 분석, 장단점까지 한눈에 정리한 포스트입니다. 거의 정렬된 데이터에 강한 알고리즘!"
categories:
  - Algorithm
tags:
  - Sorting
  - Insertion Sort
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 삽입 정렬이란?

삽입 정렬은 카드를 정렬할 때처럼, 배열의 각 원소를 이미 정렬된 부분에 적절한 위치에 삽입하는 방식으로 동작하는 정렬 알고리즘입니다. 두 번째 원소부터 시작하여 앞의 정렬된 부분에 삽입하는 방식으로, 직관적이고 이해하기 쉬운 알고리즘입니다.

## 알고리즘 동작 원리

1. **두 번째 원소부터 시작**하여 앞의 정렬된 부분과 비교
2. **적절한 위치를 찾아서 삽입**
3. **삽입 후 나머지 원소들을 한 칸씩 뒤로 이동**
4. **배열의 끝까지 반복**

## 시각적 예시

```
초기 배열: [64, 34, 25, 12, 22, 11, 90]

1단계: [64, 34, 25, 12, 22, 11, 90]
       ↑  ↑
       34 < 64 → 34를 64 앞에 삽입
       → [34, 64, 25, 12, 22, 11, 90]

2단계: [34, 64, 25, 12, 22, 11, 90]
          ↑  ↑
          25 < 64, 25 < 34 → 25를 맨 앞에 삽입
          → [25, 34, 64, 12, 22, 11, 90]

3단계: [25, 34, 64, 12, 22, 11, 90]
             ↑  ↑
             12 < 64, 12 < 34, 12 < 25 → 12를 맨 앞에 삽입
             → [12, 25, 34, 64, 22, 11, 90]

4단계: [12, 25, 34, 64, 22, 11, 90]
                ↑  ↑
                22 < 64, 22 < 34, 22 > 25 → 25 뒤에 삽입
                → [12, 22, 25, 34, 64, 11, 90]

5단계: [12, 22, 25, 34, 64, 11, 90]
                   ↑  ↑
                   11 < 64, 11 < 34, 11 < 25, 11 < 22, 11 < 12 → 11을 맨 앞에 삽입
                   → [11, 12, 22, 25, 34, 64, 90]

6단계: [11, 12, 22, 25, 34, 64, 90]
                      ↑  ↑
                      90 > 64 → 90은 이미 올바른 위치

최종 결과: [11, 12, 22, 25, 34, 64, 90]
```

## JavaScript 구현

```javascript
function insertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        // 현재 원소를 key로 저장
        let key = arr[i];
        let j = i - 1;
        
        // key보다 큰 원소들을 뒤로 이동
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // key를 적절한 위치에 삽입
        arr[j + 1] = key;
    }
    
    return arr;
}

// 사용 예시
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("정렬 전:", array);
console.log("정렬 후:", insertionSort(array));
```

## Python 구현

```python
def insertion_sort(arr):
    n = len(arr)
    
    for i in range(1, n):
        # 현재 원소를 key로 저장
        key = arr[i]
        j = i - 1
        
        # key보다 큰 원소들을 뒤로 이동
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # key를 적절한 위치에 삽입
        arr[j + 1] = key
    
    return arr

# 사용 예시
array = [64, 34, 25, 12, 22, 11, 90]
print("정렬 전:", array)
print("정렬 후:", insertion_sort(array))
```

## 성능 분석

### 시간 복잡도
- **최선의 경우**: O(n) - 이미 정렬된 배열
- **평균의 경우**: O(n²) - 일반적인 경우
- **최악의 경우**: O(n²) - 역순으로 정렬된 배열

### 공간 복잡도
- **O(1)** - 제자리 정렬 (in-place sorting)

### 안정성
- **안정 정렬** - 같은 값의 상대적 순서가 유지됨

## 최적화 기법

### 1. 이진 검색을 이용한 삽입 정렬
```javascript
function binaryInsertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let left = 0;
        let right = i;
        
        // 이진 검색으로 삽입 위치 찾기
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (arr[mid] <= key) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // 원소들을 뒤로 이동
        for (let j = i; j > left; j--) {
            arr[j] = arr[j - 1];
        }
        
        arr[left] = key;
    }
    
    return arr;
}
```

## 장단점

### 장점
- **구현이 간단**하고 이해하기 쉬움
- **제자리 정렬**로 추가 메모리가 필요 없음
- **안정 정렬**로 같은 값의 순서가 유지됨
- **작은 데이터**에 대해 매우 효율적
- **거의 정렬된 데이터**에 대해 O(n)에 가까운 성능

### 단점
- **큰 데이터**에 대해 비효율적 - O(n²) 시간 복잡도
- **많은 이동 연산** - 삽입 시 원소들을 뒤로 이동해야 함
- **역순 데이터**에 대해 최악의 성능

## 실제 사용 사례

삽입 정렬은 다음과 같은 경우에 사용됩니다:

- **작은 배열** (n < 50) - 매우 효율적
- **거의 정렬된 데이터** - 빠른 성능
- **온라인 정렬** - 데이터가 실시간으로 들어오는 경우
- **하이브리드 정렬** - 퀵 정렬의 작은 부분 배열 정렬
- **안정 정렬이 필요한 경우**

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 | 최선 시간복잡도 |
|---------|---------------|---------------|-----------|--------|---------------|
| 삽입 정렬 | O(n²) | O(n²) | O(1) | ✅ | O(n) |
| 버블 정렬 | O(n²) | O(n²) | O(1) | ✅ | O(n) |
| 선택 정렬 | O(n²) | O(n²) | O(1) | ❌ | O(n²) |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ | O(n log n) |

## 결론

삽입 정렬은 작은 데이터셋이나 거의 정렬된 데이터에 대해 매우 효율적이며, 안정 정렬이라는 장점이 있습니다. 또한 온라인 정렬에 적합하고, 다른 정렬 알고리즘의 하이브리드 구현에서도 자주 사용됩니다.

실제 프로덕션에서는 작은 배열이나 특수한 상황에서만 사용하지만, 알고리즘의 기본 원리를 이해하는 데 매우 유용한 알고리즘입니다.

---

**참고 자료:**
- [Insertion Sort - GeeksforGeeks](https://www.geeksforgeeks.org/insertion-sort/)
- [Insertion Sort - Wikipedia](https://en.wikipedia.org/wiki/Insertion_sort) 