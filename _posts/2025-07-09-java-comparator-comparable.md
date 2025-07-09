---
title: "Java Comparator와 Comparable 사용법 완벽 정리"
date: 2025-07-09 00:00:00 +0900
categories: [Java, 자료구조]
tags: [Comparator, Comparable, 정렬, 커스텀 정렬]
---

Java에서 객체를 정렬할 때 두 가지 방법이 자주 사용됩니다: `Comparable` 인터페이스와 `Comparator` 인터페이스입니다. 이 두 인터페이스는 객체 비교 및 정렬 기준 정의에 필수적인 도구로, 특히 코딩테스트와 실무 개발에서 자주 사용됩니다.

## 개념 정리
- **Comparable<T>**: 해당 클래스 내부에서 자기 자신끼리 비교할 수 있도록 정렬 기준을 정의
- **Comparator<T>**: 외부에서 비교 기준을 별도로 정의해 정렬 수행
- `Collections.sort()`, `Arrays.sort()`, `PriorityQueue` 등에서 함께 사용됨

## 주요 특징 또는 핵심 포인트
- `Comparable`은 **기본 정렬 기준**을 정의할 때 사용 (`compareTo`)
- `Comparator`는 **별도의 정렬 기준**을 외부에서 추가로 제공할 때 사용 (`compare`)
- `Comparable`은 1개의 정렬 기준만 정의 가능, `Comparator`는 여러 기준 생성 가능

## 사례 또는 사용 예시
### 1. Comparable을 이용한 기본 정렬
```java
class Person implements Comparable<Person> {
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person other) {
        return this.age - other.age; // 나이 오름차순
    }
}

// 사용
List<Person> list = new ArrayList<>();
list.add(new Person("Tom", 25));
list.add(new Person("Jane", 20));
Collections.sort(list);
```

### 2. Comparator를 이용한 외부 정렬 기준 지정
```java
List<Person> list = new ArrayList<>();
list.add(new Person("Tom", 25));
list.add(new Person("Jane", 20));

// 이름 기준 오름차순 정렬
Collections.sort(list, new Comparator<Person>() {
    @Override
    public int compare(Person p1, Person p2) {
        return p1.name.compareTo(p2.name);
    }
});
```

### 3. 람다 표현식과 Comparator.comparing
```java
// 나이 내림차순
list.sort((p1, p2) -> Integer.compare(p2.age, p1.age));

// Java 8 이상
list.sort(Comparator.comparingInt((Person p) -> p.age).reversed());
```

## 장점과 한계 또는 고려사항
### 장점
- `Comparable`: 객체 클래스 내부에 정렬 기준을 명확히 정의
- `Comparator`: 정렬 기준을 자유롭게 재정의 가능 (유연성 ↑)

### 한계 / 단점 / 주의사항
- `Comparable`은 하나의 기준만 가질 수 있음 (여러 기준 필요 시 `Comparator` 활용)
- 문자열 비교 시 `compareTo` 결과가 양수/음수/0임을 명확히 이해할 것

## 실무 적용 팁 또는 마무리
- 자주 정렬하는 기준이 있다면 `Comparable`로 정리해두면 좋습니다.
- 하나의 클래스에 다양한 기준으로 정렬이 필요하다면 `Comparator`로 유연하게 처리하세요.
- 코딩테스트에서는 객체 정렬 시 `Comparator` 람다식 사용이 간결하고 직관적입니다.

---

> 💡 "Comparable은 정렬 기준을 객체에 넣는 것이고, Comparator는 바깥에서 정렬 기준을 입히는 방식입니다!"
