---
title: "기수 정렬 (Radix Sort) - 자릿수별로 정렬하는 효율적인 알고리즘"
excerpt: "기수 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
description: "기수 정렬의 개념, 동작 원리, 구현 코드, 성능 분석, 장단점까지 한눈에 정리한 포스트입니다. 자릿수별로 정렬하는 효율적인 알고리즘!"
categories:
  - Algorithm
tags:
  - Sorting
  - Radix Sort
  - Digit-based
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 기수 정렬이란?

기수 정렬은 각 자릿수를 차례대로 정렬하는 방식으로 동작하는 정렬 알고리즘입니다. 가장 낮은 자릿수(1의 자리)부터 가장 높은 자릿수까지 순서대로 정렬하여 전체 숫자를 정렬합니다. 계수 정렬을 기반으로 하며, 정수나 문자열 데이터에 대해 매우 효율적인 성능을 보여줍니다.

## 알고리즘 동작 원리

1. **자릿수 결정** - 정렬할 데이터의 최대 자릿수를 결정
2. **낮은 자릿수부터 정렬** - 1의 자리부터 시작하여 각 자릿수별로 정렬
3. **안정 정렬 사용** - 각 자릿수 정렬 시 계수 정렬 등의 안정 정렬 사용
4. **최고 자릿수까지 반복** - 모든 자릿수를 정렬할 때까지 반복

## 시각적 예시

```
초기 배열: [170, 45, 75, 90, 802, 24, 2, 66]

1단계 - 1의 자리 정렬:
170 → 0, 45 → 5, 75 → 5, 90 → 0, 802 → 2, 24 → 4, 2 → 2, 66 → 6
→ [170, 90, 802, 2, 24, 45, 75, 66]

2단계 - 10의 자리 정렬:
170 → 7, 90 → 9, 802 → 0, 2 → 0, 24 → 2, 45 → 4, 75 → 7, 66 → 6
→ [802, 2, 24, 45, 66, 170, 75, 90]

3단계 - 100의 자리 정렬:
802 → 8, 2 → 0, 24 → 0, 45 → 0, 66 → 0, 170 → 1, 75 → 0, 90 → 0
→ [2, 24, 45, 66, 75, 90, 170, 802]

최종 결과: [2, 24, 45, 66, 75, 90, 170, 802]
```

## JavaScript 구현

```javascript
function radixSort(arr) {
    const n = arr.length;
    
    if (n === 0) return arr;
    
    // 최댓값 찾기
    const max = Math.max(...arr);
    
    // 최대 자릿수 계산
    const maxDigits = Math.floor(Math.log10(max)) + 1;
    
    // 각 자릿수별로 정렬
    for (let digit = 0; digit < maxDigits; digit++) {
        countingSortByDigit(arr, digit);
    }
    
    return arr;
}

function countingSortByDigit(arr, digit) {
    const n = arr.length;
    const count = new Array(10).fill(0);
    const output = new Array(n);
    
    // 각 자릿수의 개수 세기
    for (let i = 0; i < n; i++) {
        const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
        count[digitValue]++;
    }
    
    // 누적 합 계산
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // 정렬된 배열 생성 (역순으로 순회하여 안정성 보장)
    for (let i = n - 1; i >= 0; i--) {
        const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
        output[count[digitValue] - 1] = arr[i];
        count[digitValue]--;
    }
    
    // 원본 배열에 결과 복사
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}

// 사용 예시
const array = [170, 45, 75, 90, 802, 24, 2, 66];
console.log("정렬 전:", array);
console.log("정렬 후:", radixSort([...array]));
```

## Python 구현

```python
def radix_sort(arr):
    n = len(arr)
    
    if n == 0:
        return arr
    
    # 최댓값 찾기
    max_val = max(arr)
    
    # 최대 자릿수 계산
    max_digits = len(str(max_val))
    
    # 각 자릿수별로 정렬
    for digit in range(max_digits):
        counting_sort_by_digit(arr, digit)
    
    return arr

def counting_sort_by_digit(arr, digit):
    n = len(arr)
    count = [0] * 10
    output = [0] * n
    
    # 각 자릿수의 개수 세기
    for i in range(n):
        digit_value = (arr[i] // (10 ** digit)) % 10
        count[digit_value] += 1
    
    # 누적 합 계산
    for i in range(1, 10):
        count[i] += count[i - 1]
    
    # 정렬된 배열 생성 (역순으로 순회하여 안정성 보장)
    for i in range(n - 1, -1, -1):
        digit_value = (arr[i] // (10 ** digit)) % 10
        output[count[digit_value] - 1] = arr[i]
        count[digit_value] -= 1
    
    # 원본 배열에 결과 복사
    for i in range(n):
        arr[i] = output[i]

# 사용 예시
array = [170, 45, 75, 90, 802, 24, 2, 66]
print("정렬 전:", array)
print("정렬 후:", radix_sort(array.copy()))
```

## 성능 분석

### 시간 복잡도
- **최선의 경우**: O(d(n + k)) - 모든 경우에 동일
- **평균의 경우**: O(d(n + k)) - 일반적인 경우
- **최악의 경우**: O(d(n + k)) - 역순으로 정렬된 배열

여기서:
- d: 최대 자릿수
- n: 배열의 크기
- k: 각 자릿수의 범위 (10진수에서는 10)

### 공간 복잡도
- **O(n + k)** - 계수 정렬과 동일

### 안정성
- **안정 정렬** - 같은 값의 상대적 순서가 유지됨

## 최적화 기법

### 1. LSD vs MSD
```javascript
// LSD (Least Significant Digit) - 낮은 자릿수부터
function radixSortLSD(arr) {
    // 위의 구현과 동일
}

// MSD (Most Significant Digit) - 높은 자릿수부터
function radixSortMSD(arr, digit = null) {
    const n = arr.length;
    
    if (n <= 1) return arr;
    
    if (digit === null) {
        const max = Math.max(...arr);
        digit = Math.floor(Math.log10(max)) + 1;
    }
    
    if (digit === 0) return arr;
    
    const buckets = Array.from({length: 10}, () => []);
    
    // 각 자릿수별로 버킷에 분배
    for (let i = 0; i < n; i++) {
        const digitValue = Math.floor(arr[i] / Math.pow(10, digit - 1)) % 10;
        buckets[digitValue].push(arr[i]);
    }
    
    // 각 버킷을 재귀적으로 정렬
    const result = [];
    for (let i = 0; i < 10; i++) {
        if (buckets[i].length > 0) {
            result.push(...radixSortMSD(buckets[i], digit - 1));
        }
    }
    
    return result;
}
```

### 2. 문자열 정렬
```javascript
function radixSortString(arr) {
    const n = arr.length;
    
    if (n === 0) return arr;
    
    // 최대 길이 찾기
    const maxLength = Math.max(...arr.map(str => str.length));
    
    // 각 위치별로 정렬
    for (let pos = maxLength - 1; pos >= 0; pos--) {
        countingSortByChar(arr, pos);
    }
    
    return arr;
}

function countingSortByChar(arr, pos) {
    const n = arr.length;
    const count = new Array(256).fill(0); // ASCII 범위
    const output = new Array(n);
    
    // 각 문자의 개수 세기
    for (let i = 0; i < n; i++) {
        const char = pos < arr[i].length ? arr[i].charCodeAt(pos) : 0;
        count[char]++;
    }
    
    // 누적 합 계산
    for (let i = 1; i < 256; i++) {
        count[i] += count[i - 1];
    }
    
    // 정렬된 배열 생성
    for (let i = n - 1; i >= 0; i--) {
        const char = pos < arr[i].length ? arr[i].charCodeAt(pos) : 0;
        output[count[char] - 1] = arr[i];
        count[char]--;
    }
    
    // 원본 배열에 결과 복사
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}
```

## 장단점

### 장점
- **선형 시간 복잡도** - O(d(n + k)) 시간 복잡도
- **안정 정렬** - 같은 값의 순서가 유지됨
- **정수와 문자열 모두 가능** - 다양한 데이터 타입 지원
- **예측 가능한 성능** - 데이터 분포에 덜 민감

### 단점
- **자릿수 제한** - 자릿수가 많을 때 비효율적
- **추가 메모리 필요** - O(n + k) 공간 복잡도
- **구현 복잡성** - 다른 정렬 알고리즘보다 복잡
- **캐시 비효율적** - 배열 접근 패턴이 비연속적

## 실제 사용 사례

기수 정렬은 다음과 같은 경우에 사용됩니다:

- **정수 데이터 정렬** - 특히 자릿수가 적은 경우
- **문자열 정렬** - 사전순 정렬
- **날짜 정렬** - 년/월/일 순서로 정렬
- **IP 주소 정렬** - 점으로 구분된 숫자들
- **전화번호 정렬** - 지역번호별 정렬

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 | 데이터 타입 |
|---------|---------------|---------------|-----------|--------|------------|
| 기수 정렬 | O(d(n + k)) | O(d(n + k)) | O(n + k) | ✅ | 정수, 문자열 |
| 계수 정렬 | O(n + k) | O(n + k) | O(n + k) | ✅ | 정수 |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ | 모든 타입 |
| 병합 정렬 | O(n log n) | O(n log n) | O(n) | ✅ | 모든 타입 |

## 결론

기수 정렬은 정수와 문자열 데이터에 대해 매우 효율적인 성능을 보여주는 우수한 정렬 알고리즘입니다. 특히 자릿수가 적은 데이터나 문자열 정렬에 매우 유용합니다.

하지만 자릿수가 많거나 메모리 제약이 있는 환경에서는 다른 알고리즘을 고려해야 하며, 구현의 복잡성도 고려해야 합니다.

---

**참고 자료:**
- [Radix Sort - GeeksforGeeks](https://www.geeksforgeeks.org/radix-sort/)
- [Radix Sort - Wikipedia](https://en.wikipedia.org/wiki/Radix_sort) 