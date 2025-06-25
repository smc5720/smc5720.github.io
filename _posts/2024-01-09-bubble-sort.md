---
title: "버블 정렬 (Bubble Sort) - 가장 기본적인 정렬 알고리즘"
excerpt: "버블 정렬의 원리와 구현, 그리고 성능 분석에 대해 알아보자"
description: "버블 정렬의 개념, 동작 원리, 구현 코드, 성능 분석, 장단점까지 한눈에 정리한 포스트입니다. 알고리즘 입문자에게 추천!"
categories:
  - Algorithm
tags:
  - Sorting
  - Bubble Sort
  - JavaScript
  - Python
toc: true
toc_sticky: true
---

## 버블 정렬이란?

버블 정렬은 가장 기본적이고 직관적인 정렬 알고리즘입니다. 인접한 두 원소를 비교하여 순서가 잘못되어 있으면 교환하는 방식으로 동작합니다. 이 과정에서 큰 값들이 마치 거품(bubble)처럼 위로 올라가는 모습을 보여주어 "버블 정렬"이라는 이름이 붙었습니다.

## 알고리즘 동작 원리

1. **첫 번째 원소부터 시작**하여 인접한 원소와 비교
2. **순서가 잘못되어 있으면 교환** (오름차순: 앞 > 뒤인 경우)
3. **한 번의 순회**가 끝나면 가장 큰 값이 맨 뒤로 이동
4. **배열의 길이만큼 반복**하여 모든 원소를 정렬

## 시각적 예시

```
초기 배열: [64, 34, 25, 12, 22, 11, 90]

1단계: [64, 34, 25, 12, 22, 11, 90]
       ↑  ↑
       64 > 34 → 교환: [34, 64, 25, 12, 22, 11, 90]
          ↑  ↑
          64 > 25 → 교환: [34, 25, 64, 12, 22, 11, 90]
             ↑  ↑
             64 > 12 → 교환: [34, 25, 12, 64, 22, 11, 90]
                ↑  ↑
                64 > 22 → 교환: [34, 25, 12, 22, 64, 11, 90]
                   ↑  ↑
                   64 > 11 → 교환: [34, 25, 12, 22, 11, 64, 90]
                      ↑  ↑
                      64 < 90 → 유지: [34, 25, 12, 22, 11, 64, 90]

결과: 90이 맨 뒤로 이동
```

## JavaScript 구현

```javascript
function bubbleSort(arr) {
    const n = arr.length;
    
    // 최적화를 위한 플래그
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        
        // 인접한 원소들을 비교
        for (let j = 0; j < n - i - 1; j++) {
            // 순서가 잘못되어 있으면 교환
            if (arr[j] > arr[j + 1]) {
                // 임시 변수를 사용한 교환
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        
        // 교환이 일어나지 않았다면 이미 정렬된 상태
        if (!swapped) {
            break;
        }
    }
    
    return arr;
}

// 사용 예시
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("정렬 전:", array);
console.log("정렬 후:", bubbleSort(array));
```

## Python 구현

```python
def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        # 최적화를 위한 플래그
        swapped = False
        
        # 인접한 원소들을 비교
        for j in range(0, n - i - 1):
            # 순서가 잘못되어 있으면 교환
            if arr[j] > arr[j + 1]:
                # Python의 다중 할당을 이용한 교환
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # 교환이 일어나지 않았다면 이미 정렬된 상태
        if not swapped:
            break
    
    return arr

# 사용 예시
array = [64, 34, 25, 12, 22, 11, 90]
print("정렬 전:", array)
print("정렬 후:", bubble_sort(array))
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

### 1. 조기 종료 (Early Termination)
```javascript
// 교환이 일어나지 않으면 이미 정렬된 상태
if (!swapped) {
    break;
}
```

### 2. 마지막 교환 위치 기억
```javascript
function optimizedBubbleSort(arr) {
    const n = arr.length;
    let lastSwap = n - 1;
    
    for (let i = 0; i < n - 1; i++) {
        let newLastSwap = 0;
        
        for (let j = 0; j < lastSwap; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                newLastSwap = j;
            }
        }
        
        lastSwap = newLastSwap;
        
        if (lastSwap === 0) break;
    }
    
    return arr;
}
```

## 장단점

### 장점
- **구현이 간단**하고 이해하기 쉬움
- **제자리 정렬**로 추가 메모리가 필요 없음
- **안정 정렬**로 같은 값의 순서가 유지됨
- **작은 데이터**에 대해 효율적

### 단점
- **매우 비효율적** - O(n²) 시간 복잡도
- **큰 데이터**에 대해 실용적이지 않음
- **교환 횟수**가 많아 성능이 떨어짐

## 실제 사용 사례

버블 정렬은 교육 목적이나 매우 작은 데이터셋에서만 사용됩니다:

- **알고리즘 학습** - 정렬의 기본 개념 이해
- **작은 배열** (n < 10) - 간단한 구현이 필요한 경우
- **거의 정렬된 데이터** - 최적화된 버전 사용 시

## 다른 정렬 알고리즘과의 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 안정성 |
|---------|---------------|---------------|-----------|--------|
| 버블 정렬 | O(n²) | O(n²) | O(1) | ✅ |
| 선택 정렬 | O(n²) | O(n²) | O(1) | ❌ |
| 삽입 정렬 | O(n²) | O(n²) | O(1) | ✅ |
| 퀵 정렬 | O(n log n) | O(n²) | O(log n) | ❌ |
| 병합 정렬 | O(n log n) | O(n log n) | O(n) | ✅ |

## 결론

버블 정렬은 정렬 알고리즘의 기본을 이해하는 데 매우 유용하지만, 실제 프로덕션에서는 사용하지 않는 것이 좋습니다. 대신 퀵 정렬, 병합 정렬, 또는 언어별 내장 정렬 함수를 사용하는 것이 효율적입니다.

하지만 알고리즘의 기본 원리를 배우고, 최적화 기법을 이해하는 데는 여전히 가치 있는 알고리즘입니다.

---

**참고 자료:**
- [Bubble Sort - GeeksforGeeks](https://www.geeksforgeeks.org/bubble-sort/)
- [Bubble Sort - Wikipedia](https://en.wikipedia.org/wiki/Bubble_sort) 