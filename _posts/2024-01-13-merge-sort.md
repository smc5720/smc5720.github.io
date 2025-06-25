---
title: "병합 정렬 (Merge Sort) - 안정적이고 예측 가능한 분할 정복 정렬"
excerpt: "병합 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
categories:
  - Algorithm
tags:
  - Sorting
  - Merge Sort
  - Divide and Conquer
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 병합 정렬이란?

병합 정렬은 분할 정복(Divide and Conquer) 전략을 사용하는 정렬 알고리즘입니다. 배열을 두 개의 균등한 부분으로 분할하고, 각 부분을 재귀적으로 정렬한 후, 정렬된 두 부분을 병합하는 방식으로 동작합니다. 안정 정렬이며, 예측 가능한 성능을 보여주는 장점이 있습니다.

## 알고리즘 동작 원리

1. **분할(Divide)** - 배열을 두 개의 균등한 부분으로 분할
2. **정복(Conquer)** - 각 부분을 재귀적으로 정렬
3. **병합(Merge)** - 정렬된 두 부분을 하나로 병합
4. **기저 조건** - 배열의 크기가 1이면 이미 정렬된 상태

## 시각적 예시

```
초기 배열: [64, 34, 25, 12, 22, 11, 90]

1단계 - 분할:
[64, 34, 25, 12, 22, 11, 90]
→ [64, 34, 25] [12, 22, 11, 90]
→ [64] [34, 25] [12, 22] [11, 90]
→ [64] [34] [25] [12] [22] [11] [90]

2단계 - 정렬 및 병합:
[64] [34] [25] [12] [22] [11] [90]
→ [34, 64] [25] [12, 22] [11, 90]
→ [25, 34, 64] [11, 12, 22, 90]
→ [11, 12, 22, 25, 34, 64, 90]

최종 결과: [11, 12, 22, 25, 34, 64, 90]
```

## JavaScript 구현

```javascript
function mergeSort(arr) {
    const n = arr.length;
    
    // 기저 조건: 배열의 크기가 1 이하면 이미 정렬됨
    if (n <= 1) {
        return arr;
    }
    
    // 배열을 두 부분으로 분할
    const mid = Math.floor(n / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    // 각 부분을 재귀적으로 정렬
    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);
    
    // 정렬된 두 부분을 병합
    return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    // 두 배열의 원소를 비교하여 작은 것부터 결과 배열에 추가
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    // 남은 원소들을 결과 배열에 추가
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }
    
    return result;
}

// 사용 예시
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("정렬 전:", array);
console.log("정렬 후:", mergeSort(array));
```

## Python 구현

```python
def merge_sort(arr):
    n = len(arr)
    
    # 기저 조건: 배열의 크기가 1 이하면 이미 정렬됨
    if n <= 1:
        return arr
    
    # 배열을 두 부분으로 분할
    mid = n // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # 각 부분을 재귀적으로 정렬
    sorted_left = merge_sort(left)
    sorted_right = merge_sort(right)
    
    # 정렬된 두 부분을 병합
    return merge(sorted_left, sorted_right)

def merge(left, right):
    result = []
    i = j = 0
    
    # 두 배열의 원소를 비교하여 작은 것부터 결과 배열에 추가
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # 남은 원소들을 결과 배열에 추가
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result

# 사용 예시
array = [64, 34, 25, 12, 22, 11, 90]
print("정렬 전:", array)
print("정렬 후:", merge_sort(array))
```

## 제자리 병합 정렬 (In-place Merge Sort)

```javascript
function mergeSortInPlace(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // 왼쪽 부분 정렬
        mergeSortInPlace(arr, left, mid);
        
        // 오른쪽 부분 정렬
        mergeSortInPlace(arr, mid + 1, right);
        
        // 두 부분 병합
        mergeInPlace(arr, left, mid, right);
    }
    
    return arr;
}

function mergeInPlace(arr, left, mid, right) {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            arr[k] = leftArray[i];
            i++;
        } else {
            arr[k] = rightArray[j];
            j++;
        }
        k++;
    }
    
    // 남은 원소들 복사
    while (i < leftArray.length) {
        arr[k] = leftArray[i];
        i++;
        k++;
    }
    
    while (j < rightArray.length) {
        arr[k] = rightArray[j];
        j++;
        k++;
    }
}
```

## 성능 분석

### 시간 복잡도
- **최선의 경우**: O(n log n) - 모든 경우에 동일
- **평균의 경우**: O(n log n) - 일반적인 경우
- **최악의 경우**: O(n log n) - 역순으로 정렬된 배열

### 공간 복잡도
- **O(n)** - 병합 과정에서 추가 배열 필요

### 안정성
- **안정 정렬** - 같은 값의 상대적 순서가 유지됨

## 최적화 기법

### 1. 작은 배열에 대한 삽입 정렬
```javascript
function mergeSortOptimized(arr) {
    const CUTOFF = 7; // 작은 배열의 임계값
    
    if (arr.length <= CUTOFF) {
        return insertionSort(arr);
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSortOptimized(arr.slice(0, mid));
    const right = mergeSortOptimized(arr.slice(mid));
    
    return merge(left, right);
}
```

### 2. 병합 최적화
```javascript
function mergeOptimized(left, right) {
    // 이미 정렬된 경우 빠른 병합
    if (left[left.length - 1] <= right[0]) {
        return [...left, ...right];
    }
    
    if (right[right.length - 1] <= left[0]) {
        return [...right, ...left];
    }
    
    // 일반적인 병합 수행
    return merge(left, right);
}
```

## 장단점

### 장점
- **예측 가능한 성능** - 항상 O(n log n) 시간 복잡도
- **안정 정렬** - 같은 값의 순서가 유지됨
- **병렬 처리 가능** - 분할된 부분을 병렬로 처리 가능
- **외부 정렬에 적합** - 대용량 데이터 처리 가능

### 단점
- **추가 메모리 필요** - O(n) 공간 복잡도
- **캐시 비효율적** - 배열 접근 패턴이 비연속적
- **작은 데이터에 비효율적** - 오버헤드가 큼

## 실제 사용 사례

병합 정렬은 다음과 같은 경우에 사용됩니다:

- **안정 정렬이 필요한 경우** - 같은 값의 순서 보장
- **예측 가능한 성능이 중요한 경우** - 항상 O(n log n)
- **외부 정렬** - 메모리보다 큰 데이터 정렬
- **병렬 처리** - 멀티스레드 환경
- **링크드 리스트 정렬** - 제자리 정렬 가능

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 | 예측 가능성 |
|---------|---------------|---------------|-----------|--------|------------|
| 병합 정렬 | O(n log n) | O(n log n) | O(n) | ✅ | 높음 |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ | 보통 |
| 힙 정렬 | O(n log n) | O(n log n) | O(1) | ❌ | 높음 |
| 삽입 정렬 | O(n²) | O(n²) | O(1) | ✅ | 낮음 |

## 결론

병합 정렬은 안정적이고 예측 가능한 성능을 제공하는 우수한 정렬 알고리즘입니다. 특히 안정 정렬이 필요한 경우나 외부 정렬에 매우 유용합니다.

하지만 추가 메모리가 필요하고 작은 데이터에 대해서는 비효율적이라는 단점이 있으므로, 사용 상황에 따라 적절한 알고리즘을 선택하는 것이 중요합니다.

---

**참고 자료:**
- [Merge Sort - GeeksforGeeks](https://www.geeksforgeeks.org/merge-sort/)
- [Merge Sort - Wikipedia](https://en.wikipedia.org/wiki/Merge_sort) 