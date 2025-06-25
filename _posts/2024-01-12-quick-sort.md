---
title: "퀵 정렬 (Quick Sort) - 분할 정복의 대표적인 정렬 알고리즘"
excerpt: "퀵 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
categories:
  - Algorithm
tags:
  - Sorting
  - Quick Sort
  - Divide and Conquer
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 퀵 정렬이란?

퀵 정렬은 분할 정복(Divide and Conquer) 전략을 사용하는 정렬 알고리즘입니다. 피벗(pivot)을 선택하고, 피벗을 기준으로 배열을 두 부분으로 나누어 정렬하는 방식으로 동작합니다. 평균적으로 매우 빠른 성능을 보이며, 실제로 가장 많이 사용되는 정렬 알고리즘 중 하나입니다.

## 알고리즘 동작 원리

1. **피벗 선택** - 배열에서 하나의 원소를 피벗으로 선택
2. **분할(Partition)** - 피벗을 기준으로 작은 값들은 왼쪽, 큰 값들은 오른쪽으로 분할
3. **재귀 정렬** - 분할된 두 부분 배열에 대해 재귀적으로 퀵 정렬 수행
4. **결합** - 정렬된 부분 배열들을 결합 (퀵 정렬에서는 추가 작업 불필요)

## 시각적 예시

```
초기 배열: [64, 34, 25, 12, 22, 11, 90]

1단계 - 피벗 선택 (마지막 원소 90):
[64, 34, 25, 12, 22, 11, 90]
                        ↑
                      피벗

2단계 - 분할:
90보다 작은 값들: [64, 34, 25, 12, 22, 11]
90보다 큰 값들: []
피벗: [90]

3단계 - 왼쪽 부분 재귀 정렬:
[64, 34, 25, 12, 22, 11] → 피벗 11 선택
[11, 34, 25, 12, 22, 64] → 분할 후
[11] + [34, 25, 12, 22, 64] → 오른쪽 부분 재귀 정렬
[11] + [12, 25, 22, 34, 64] → 최종 정렬

4단계 - 결합:
[11, 12, 22, 25, 34, 64, 90]
```

## JavaScript 구현

```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        // 분할하고 피벗의 위치를 얻음
        const pivotIndex = partition(arr, left, right);
        
        // 피벗을 제외한 왼쪽 부분 정렬
        quickSort(arr, left, pivotIndex - 1);
        
        // 피벗을 제외한 오른쪽 부분 정렬
        quickSort(arr, pivotIndex + 1, right);
    }
    
    return arr;
}

function partition(arr, left, right) {
    // 피벗을 마지막 원소로 선택
    const pivot = arr[right];
    let i = left - 1; // 작은 원소들의 마지막 인덱스
    
    // 피벗보다 작은 원소들을 왼쪽으로 이동
    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    // 피벗을 올바른 위치로 이동
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    
    return i + 1; // 피벗의 새 위치
}

// 사용 예시
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("정렬 전:", array);
console.log("정렬 후:", quickSort([...array]));
```

## Python 구현

```python
def quick_sort(arr, left=None, right=None):
    if left is None:
        left = 0
    if right is None:
        right = len(arr) - 1
    
    if left < right:
        # 분할하고 피벗의 위치를 얻음
        pivot_index = partition(arr, left, right)
        
        # 피벗을 제외한 왼쪽 부분 정렬
        quick_sort(arr, left, pivot_index - 1)
        
        # 피벗을 제외한 오른쪽 부분 정렬
        quick_sort(arr, pivot_index + 1, right)
    
    return arr

def partition(arr, left, right):
    # 피벗을 마지막 원소로 선택
    pivot = arr[right]
    i = left - 1  # 작은 원소들의 마지막 인덱스
    
    # 피벗보다 작은 원소들을 왼쪽으로 이동
    for j in range(left, right):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # 피벗을 올바른 위치로 이동
    arr[i + 1], arr[right] = arr[right], arr[i + 1]
    
    return i + 1  # 피벗의 새 위치

# 사용 예시
array = [64, 34, 25, 12, 22, 11, 90]
print("정렬 전:", array)
print("정렬 후:", quick_sort(array.copy()))
```

## 성능 분석

### 시간 복잡도
- **최선의 경우**: O(n log n) - 피벗이 항상 중간값인 경우
- **평균의 경우**: O(n log n) - 일반적인 경우
- **최악의 경우**: O(n²) - 피벗이 항상 최솟값이나 최댓값인 경우

### 공간 복잡도
- **평균**: O(log n) - 재귀 호출 스택
- **최악**: O(n) - 불균형한 분할

### 안정성
- **불안정 정렬** - 같은 값의 상대적 순서가 바뀔 수 있음

## 최적화 기법

### 1. 피벗 선택 최적화
```javascript
function choosePivot(arr, left, right) {
    // 중간값을 피벗으로 선택 (3개 원소의 중간값)
    const mid = Math.floor((left + right) / 2);
    const a = arr[left];
    const b = arr[mid];
    const c = arr[right];
    
    if (a <= b && b <= c) return mid;
    if (c <= b && b <= a) return mid;
    if (a <= c && c <= b) return right;
    if (b <= c && c <= a) return right;
    return left;
}
```

### 2. 작은 배열에 대한 삽입 정렬
```javascript
function quickSortOptimized(arr, left = 0, right = arr.length - 1) {
    const CUTOFF = 10; // 작은 배열의 임계값
    
    if (right - left <= CUTOFF) {
        // 작은 배열은 삽입 정렬 사용
        insertionSort(arr, left, right);
        return arr;
    }
    
    if (left < right) {
        const pivotIndex = partition(arr, left, right);
        quickSortOptimized(arr, left, pivotIndex - 1);
        quickSortOptimized(arr, pivotIndex + 1, right);
    }
    
    return arr;
}
```

### 3. 3-way 분할 (중복 원소 처리)
```javascript
function quickSort3Way(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const [lt, gt] = partition3Way(arr, left, right);
        quickSort3Way(arr, left, lt - 1);
        quickSort3Way(arr, gt + 1, right);
    }
    return arr;
}

function partition3Way(arr, left, right) {
    const pivot = arr[left];
    let lt = left;     // 피벗보다 작은 원소들의 끝
    let gt = right;    // 피벗보다 큰 원소들의 시작
    let i = left + 1;  // 현재 검사 중인 원소
    
    while (i <= gt) {
        if (arr[i] < pivot) {
            [arr[lt], arr[i]] = [arr[i], arr[lt]];
            lt++;
            i++;
        } else if (arr[i] > pivot) {
            [arr[gt], arr[i]] = [arr[i], arr[gt]];
            gt--;
        } else {
            i++;
        }
    }
    
    return [lt, gt];
}
```

## 장단점

### 장점
- **평균적으로 매우 빠름** - O(n log n) 시간 복잡도
- **제자리 정렬** - 추가 메모리 사용량이 적음
- **캐시 친화적** - 지역성이 좋음
- **실제로 가장 많이 사용** - 대부분의 언어에서 기본 정렬로 사용

### 단점
- **불안정 정렬** - 같은 값의 순서가 보장되지 않음
- **최악의 경우 O(n²)** - 불균형한 분할 시
- **재귀 호출** - 스택 오버플로우 가능성
- **피벗 선택의 중요성** - 성능에 큰 영향

## 실제 사용 사례

퀵 정렬은 다음과 같은 경우에 사용됩니다:

- **일반적인 정렬** - 대부분의 상황에서 가장 효율적
- **내장 정렬 함수** - 많은 프로그래밍 언어의 기본 정렬
- **대용량 데이터** - 메모리 효율적
- **실시간 시스템** - 예측 가능한 평균 성능

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 | 실제 성능 |
|---------|---------------|---------------|-----------|--------|----------|
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ | 매우 빠름 |
| 병합 정렬 | O(n log n) | O(n log n) | O(n) | ✅ | 빠름 |
| 힙 정렬 | O(n log n) | O(n log n) | O(1) | ❌ | 보통 |
| 삽입 정렬 | O(n²) | O(n²) | O(1) | ✅ | 작은 데이터에 빠름 |

## 결론

퀵 정렬은 평균적으로 가장 효율적인 정렬 알고리즘 중 하나이며, 실제 프로덕션에서 가장 많이 사용됩니다. 하지만 최악의 경우를 방지하기 위한 최적화 기법들을 적용하는 것이 중요합니다.

피벗 선택, 작은 배열 처리, 중복 원소 처리 등의 최적화를 통해 더욱 안정적이고 효율적인 정렬을 구현할 수 있습니다.

---

**참고 자료:**
- [Quick Sort - GeeksforGeeks](https://www.geeksforgeeks.org/quick-sort/)
- [Quick Sort - Wikipedia](https://en.wikipedia.org/wiki/Quicksort) 