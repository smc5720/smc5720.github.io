---
title: "계수 정렬 (Counting Sort) - 선형 시간 복잡도의 정수 정렬 알고리즘"
excerpt: "계수 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
description: "계수 정렬의 개념, 동작 원리, 구현 코드, 성능 분석, 장단점까지 한눈에 정리한 포스트입니다. 정수 데이터에 최적화된 선형 정렬!"
categories:
  - Algorithm
tags:
  - Sorting
  - Counting Sort
  - Linear Time
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 계수 정렬이란?

계수 정렬은 각 원소의 개수를 세어서 정렬하는 방식으로 동작하는 정렬 알고리즘입니다. 비교 기반 정렬이 아닌 카운팅 기반 정렬로, 정수 데이터에 대해 O(n + k) 시간 복잡도를 달성할 수 있습니다. 여기서 k는 데이터의 범위를 나타냅니다.

## 알고리즘 동작 원리

1. **카운트 배열 생성** - 데이터 범위만큼의 크기를 가진 배열 생성
2. **원소 개수 세기** - 각 원소의 등장 횟수를 카운트 배열에 기록
3. **누적 합 계산** - 카운트 배열의 누적 합을 계산하여 위치 정보 생성
4. **정렬된 배열 생성** - 원본 배열을 역순으로 순회하며 정렬된 배열 생성

## 시각적 예시

```
초기 배열: [4, 2, 1, 4, 1, 3, 2]

1단계 - 카운트 배열 생성 (범위: 1~4):
count[1] = 0, count[2] = 0, count[3] = 0, count[4] = 0

2단계 - 원소 개수 세기:
4 → count[4]++ → count[4] = 1
2 → count[2]++ → count[2] = 1
1 → count[1]++ → count[1] = 1
4 → count[4]++ → count[4] = 2
1 → count[1]++ → count[1] = 2
3 → count[3]++ → count[3] = 1
2 → count[2]++ → count[2] = 2

카운트 배열: [0, 2, 2, 1, 2]
             0  1  2  3  4

3단계 - 누적 합 계산:
count[1] = 2
count[2] = count[1] + count[2] = 2 + 2 = 4
count[3] = count[2] + count[3] = 4 + 1 = 5
count[4] = count[3] + count[4] = 5 + 2 = 7

누적 합: [0, 2, 4, 5, 7]
         0  1  2  3  4

4단계 - 정렬된 배열 생성 (역순):
2 → count[2] = 4 → output[3] = 2, count[2] = 3
3 → count[3] = 5 → output[4] = 3, count[3] = 4
1 → count[1] = 2 → output[1] = 1, count[1] = 1
1 → count[1] = 1 → output[0] = 1, count[1] = 0
4 → count[4] = 7 → output[6] = 4, count[4] = 6
4 → count[4] = 6 → output[5] = 4, count[4] = 5
2 → count[2] = 3 → output[2] = 2, count[2] = 2

최종 결과: [1, 1, 2, 2, 3, 4, 4]
```

## JavaScript 구현

```javascript
function countingSort(arr) {
    const n = arr.length;
    
    if (n === 0) return arr;
    
    // 최댓값과 최솟값 찾기
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    
    // 카운트 배열 초기화
    const count = new Array(range).fill(0);
    const output = new Array(n);
    
    // 각 원소의 개수 세기
    for (let i = 0; i < n; i++) {
        count[arr[i] - min]++;
    }
    
    // 누적 합 계산
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // 정렬된 배열 생성 (역순으로 순회하여 안정성 보장)
    for (let i = n - 1; i >= 0; i--) {
        const index = arr[i] - min;
        output[count[index] - 1] = arr[i];
        count[index]--;
    }
    
    // 원본 배열에 결과 복사
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }
    
    return arr;
}

// 사용 예시
const array = [4, 2, 1, 4, 1, 3, 2];
console.log("정렬 전:", array);
console.log("정렬 후:", countingSort([...array]));
```

## Python 구현

```python
def counting_sort(arr):
    n = len(arr)
    
    if n == 0:
        return arr
    
    # 최댓값과 최솟값 찾기
    max_val = max(arr)
    min_val = min(arr)
    range_val = max_val - min_val + 1
    
    # 카운트 배열 초기화
    count = [0] * range_val
    output = [0] * n
    
    # 각 원소의 개수 세기
    for i in range(n):
        count[arr[i] - min_val] += 1
    
    # 누적 합 계산
    for i in range(1, range_val):
        count[i] += count[i - 1]
    
    # 정렬된 배열 생성 (역순으로 순회하여 안정성 보장)
    for i in range(n - 1, -1, -1):
        index = arr[i] - min_val
        output[count[index] - 1] = arr[i]
        count[index] -= 1
    
    # 원본 배열에 결과 복사
    for i in range(n):
        arr[i] = output[i]
    
    return arr

# 사용 예시
array = [4, 2, 1, 4, 1, 3, 2]
print("정렬 전:", array)
print("정렬 후:", counting_sort(array.copy()))
```

## 성능 분석

### 시간 복잡도
- **최선의 경우**: O(n + k) - 모든 경우에 동일
- **평균의 경우**: O(n + k) - 일반적인 경우
- **최악의 경우**: O(n + k) - 역순으로 정렬된 배열

### 공간 복잡도
- **O(n + k)** - 카운트 배열과 출력 배열 필요

### 안정성
- **안정 정렬** - 같은 값의 상대적 순서가 유지됨

## 최적화 기법

### 1. 범위 최적화
```javascript
function countingSortOptimized(arr) {
    const n = arr.length;
    
    if (n === 0) return arr;
    
    // 범위가 너무 크면 다른 정렬 알고리즘 사용
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    
    // 범위가 너무 크면 퀵 정렬 사용
    if (range > n * 2) {
        return arr.sort((a, b) => a - b);
    }
    
    // 일반적인 계수 정렬 수행
    return countingSort(arr);
}
```

### 2. 제자리 계수 정렬 (In-place)
```javascript
function countingSortInPlace(arr) {
    const n = arr.length;
    
    if (n === 0) return arr;
    
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    
    const count = new Array(range).fill(0);
    
    // 각 원소의 개수 세기
    for (let i = 0; i < n; i++) {
        count[arr[i] - min]++;
    }
    
    // 제자리 정렬
    let index = 0;
    for (let i = 0; i < range; i++) {
        while (count[i] > 0) {
            arr[index] = i + min;
            index++;
            count[i]--;
        }
    }
    
    return arr;
}
```

## 장단점

### 장점
- **선형 시간 복잡도** - O(n + k) 시간 복잡도
- **안정 정렬** - 같은 값의 순서가 유지됨
- **정수 데이터에 효율적** - 범위가 작은 정수 데이터에 매우 빠름
- **구현이 간단** - 이해하기 쉬운 알고리즘

### 단점
- **범위 제한** - 데이터 범위가 클 때 비효율적
- **추가 메모리 필요** - O(n + k) 공간 복잡도
- **정수 데이터만 가능** - 실수나 문자열에는 적용 불가
- **범위가 클 때 비효율적** - k가 n보다 훨씬 클 때

## 실제 사용 사례

계수 정렬은 다음과 같은 경우에 사용됩니다:

- **작은 범위의 정수 데이터** - 성적, 나이, 우편번호 등
- **빈도수 계산** - 각 원소의 등장 횟수 파악
- **기수 정렬의 기반** - 각 자릿수별 정렬
- **히스토그램 생성** - 데이터 분포 분석
- **중복 제거** - 고유한 원소 개수 파악

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 | 데이터 타입 |
|---------|---------------|---------------|-----------|--------|------------|
| 계수 정렬 | O(n + k) | O(n + k) | O(n + k) | ✅ | 정수 |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ | 모든 타입 |
| 병합 정렬 | O(n log n) | O(n log n) | O(n) | ✅ | 모든 타입 |
| 삽입 정렬 | O(n²) | O(n²) | O(1) | ✅ | 모든 타입 |

## 결론

계수 정렬은 정수 데이터에 대해 선형 시간 복잡도를 달성할 수 있는 매우 효율적인 알고리즘입니다. 특히 데이터 범위가 작은 경우에 매우 빠른 성능을 보여줍니다.

하지만 데이터 범위가 클 때는 비효율적이므로, 사용 전에 데이터의 특성을 잘 파악하고 적절한 알고리즘을 선택하는 것이 중요합니다.

---

**참고 자료:**
- [Counting Sort - GeeksforGeeks](https://www.geeksforgeeks.org/counting-sort/)
- [Counting Sort - Wikipedia](https://en.wikipedia.org/wiki/Counting_sort) 