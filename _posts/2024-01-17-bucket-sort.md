---
title: "버킷 정렬 (Bucket Sort) - 구간별로 나누어 정렬하는 알고리즘"
excerpt: "버킷 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
description: "버킷 정렬의 개념, 동작 원리, 구현 코드, 성능 분석, 장단점까지 한눈에 정리한 포스트입니다. 실수 데이터나 균등 분포 데이터에 강력 추천!"
categories:
  - Algorithm
tags:
  - Sorting
  - Bucket Sort
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 버킷 정렬이란?

버킷 정렬은 데이터를 여러 개의 버킷(구간)으로 나누고, 각 버킷을 개별적으로 정렬한 뒤, 버킷을 합쳐 전체를 정렬하는 알고리즘입니다. 데이터가 균등하게 분포되어 있을 때 매우 효율적이며, 보통 삽입 정렬이나 다른 효율적인 정렬 알고리즘과 함께 사용됩니다.

## 알고리즘 동작 원리

1. **버킷 생성** - 데이터의 범위에 따라 여러 개의 버킷을 생성
2. **데이터 분배** - 각 데이터를 해당하는 버킷에 분배
3. **버킷별 정렬** - 각 버킷을 개별적으로 정렬(삽입 정렬 등 사용)
4. **버킷 합치기** - 정렬된 버킷을 차례대로 합쳐 최종 정렬 결과 생성

## 시각적 예시

```
초기 배열: [0.42, 4.21, 3.14, 2.71, 1.61, 0.73, 2.58]

1단계 - 버킷 생성 (예: 0~1, 1~2, 2~3, 3~4, 4~5):
[0.42, 0.73] | [1.61] | [2.58, 2.71] | [3.14] | [4.21]

2단계 - 각 버킷 정렬:
[0.42, 0.73] | [1.61] | [2.58, 2.71] | [3.14] | [4.21]

3단계 - 버킷 합치기:
[0.42, 0.73, 1.61, 2.58, 2.71, 3.14, 4.21]
```

## JavaScript 구현

```javascript
function bucketSort(arr, bucketSize = 1) {
    if (arr.length === 0) return arr;

    // 최솟값과 최댓값 찾기
    let min = Math.min(...arr);
    let max = Math.max(...arr);

    // 버킷 개수 계산
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = Array.from({ length: bucketCount }, () => []);

    // 각 데이터를 버킷에 분배
    for (let i = 0; i < arr.length; i++) {
        const idx = Math.floor((arr[i] - min) / bucketSize);
        buckets[idx].push(arr[i]);
    }

    // 각 버킷 정렬(삽입 정렬 사용)
    arr.length = 0;
    for (let i = 0; i < buckets.length; i++) {
        insertionSort(buckets[i]);
        arr.push(...buckets[i]);
    }
    return arr;
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

// 사용 예시
const array = [0.42, 4.21, 3.14, 2.71, 1.61, 0.73, 2.58];
console.log("정렬 전:", array);
console.log("정렬 후:", bucketSort([...array], 1));
```

## Python 구현

```python
def bucket_sort(arr, bucket_size=1):
    if len(arr) == 0:
        return arr

    # 최솟값과 최댓값 찾기
    min_val = min(arr)
    max_val = max(arr)

    # 버킷 개수 계산
    bucket_count = int((max_val - min_val) / bucket_size) + 1
    buckets = [[] for _ in range(bucket_count)]

    # 각 데이터를 버킷에 분배
    for num in arr:
        idx = int((num - min_val) / bucket_size)
        buckets[idx].append(num)

    # 각 버킷 정렬(삽입 정렬 사용)
    arr.clear()
    for bucket in buckets:
        insertion_sort(bucket)
        arr.extend(bucket)
    return arr

def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# 사용 예시
array = [0.42, 4.21, 3.14, 2.71, 1.61, 0.73, 2.58]
print("정렬 전:", array)
print("정렬 후:", bucket_sort(array.copy(), 1))
```

## 성능 분석

### 시간 복잡도
- **최선의 경우**: O(n + k) (k: 버킷 개수)
- **평균의 경우**: O(n + k)
- **최악의 경우**: O(n²) (모든 데이터가 한 버킷에 몰릴 때)

### 공간 복잡도
- **O(n + k)** (버킷과 임시 배열 필요)

### 안정성
- **안정 정렬 아님** (버킷 내 정렬이 안정 정렬이면 안정 정렬 가능)

## 장단점

### 장점
- **선형 시간 복잡도 가능** (데이터가 균등 분포일 때)
- **병렬 처리 용이** (버킷별로 분할 가능)
- **실수 데이터 정렬에 적합**

### 단점
- **데이터 분포에 민감** (불균형 분포 시 비효율적)
- **버킷 크기/개수 선택이 중요**
- **추가 메모리 필요**

## 실제 사용 사례

- **실수 데이터 정렬**
- **데이터가 균등 분포된 경우**
- **병렬 정렬 시스템**
- **외부 정렬(대용량 데이터)**

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 | 데이터 타입 |
|---------|---------------|---------------|-----------|--------|------------|
| 버킷 정렬 | O(n + k) | O(n²) | O(n + k) | ❌ | 실수, 정수 |
| 계수 정렬 | O(n + k) | O(n + k) | O(n + k) | ✅ | 정수 |
| 기수 정렬 | O(d(n + k)) | O(d(n + k)) | O(n + k) | ✅ | 정수, 문자열 |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ | 모든 타입 |

## 결론

버킷 정렬은 데이터가 균등하게 분포되어 있을 때 매우 빠른 성능을 보여주는 알고리즘입니다. 실수 데이터나 대용량 데이터, 병렬 처리 환경에서 유용하게 사용됩니다. 하지만 데이터 분포나 버킷 설정에 따라 성능이 크게 달라질 수 있으므로, 상황에 맞게 사용하는 것이 중요합니다.

---

**참고 자료:**
- [Bucket Sort - GeeksforGeeks](https://www.geeksforgeeks.org/bucket-sort/)
- [Bucket Sort - Wikipedia](https://en.wikipedia.org/wiki/Bucket_sort) 