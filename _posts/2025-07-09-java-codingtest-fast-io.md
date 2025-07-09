---
title: "Java 코딩테스트 입출력 최적화 방법"
date: 2025-07-09 00:00:00 +0900
categories: [Java, Coding Test]
tags: [입출력 최적화, BufferedReader, StringTokenizer, FastIO]
---

Java는 기본적으로 입출력이 느린 언어 중 하나로, 코딩테스트에서는 시간 초과(Time Limit Exceeded)를 피하기 위해 입출력 성능을 최적화하는 것이 매우 중요합니다. 본 포스트에서는 코딩테스트에서 자주 사용되는 빠른 입력 및 출력 처리 방법을 정리합니다.

## 개념 정리
- **표준 입출력 (System.in / System.out)**: Java 기본 입출력 방식은 `Scanner`, `System.out.print`이나, 속도가 느리기 때문에 코딩테스트에 비효율적입니다.
- **BufferedReader / BufferedWriter**: 버퍼를 사용해 읽기/쓰기를 최적화합니다.
- **StringTokenizer / split**: 문자열을 공백 또는 구분자로 나누기 위한 도구입니다.

## 주요 특징 또는 핵심 포인트
- `BufferedReader`는 `Scanner`보다 5~10배 빠르며, 문자열 기반 입력에 적합합니다.
- `BufferedWriter` 또는 `StringBuilder`를 사용해 출력 횟수를 줄이면 시간 초과를 방지할 수 있습니다.
- `StringTokenizer`는 `split`보다 성능이 더 뛰어나며, 대량 데이터 파싱에 유리합니다.

## 사례 또는 사용 예시
### 1. BufferedReader + StringTokenizer 사용 예시
```java
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());

        int a = Integer.parseInt(st.nextToken());
        int b = Integer.parseInt(st.nextToken());

        System.out.println(a + b);
    }
}
```
- 참고: `readLine()`은 한 줄 전체를 입력받기 때문에 `StringTokenizer`로 토큰을 분리하여 사용합니다.

### 2. BufferedWriter 또는 StringBuilder로 출력 최적화
```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
        bw.write("Hello\n");
        bw.write("World\n");
        bw.flush(); // 출력 버퍼를 비워주는 과정이 필요
    }
}
```
또는,
```java
StringBuilder sb = new StringBuilder();
sb.append("Hello\n").append("World\n");
System.out.print(sb.toString());
```

## 장점과 한계 또는 고려사항
### 장점
- 속도 개선: `Scanner` 대비 5~10배 빠른 입력 성능
- 대용량 입력 처리에 유리
- 코드 실행 시간 감소로 시간 초과 회피

### 한계 / 단점 / 주의사항
- 예외 처리: `IOException`을 반드시 처리해야 함 (`throws` 또는 `try-catch`)
- 복잡한 입력 형식 처리 시 파싱 코드가 길어질 수 있음
- `BufferedWriter`는 출력 후 `flush()` 또는 `close()`를 호출하지 않으면 결과가 출력되지 않음

## 실무 적용 팁 또는 마무리
- **입력 데이터가 많은 문제에서는 반드시 `BufferedReader`를 사용**하세요.
- **한 번에 출력할 수 있도록 `StringBuilder`를 활용**하면, 불필요한 출력 호출을 줄여 성능을 높일 수 있습니다.
- **Scanner와 println의 사용은 가급적 피하는 것이 좋습니다.**
- 코딩테스트 플랫폼에 따라 표준 입출력을 사용하는 것이 일반적이므로, **파일 입출력은 피하세요**.

---

> 💡 "BufferedReader + StringTokenizer + StringBuilder 조합은 Java 코딩테스트 입출력의 3대장입니다!"
