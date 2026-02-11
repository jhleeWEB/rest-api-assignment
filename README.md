# REST API 설계

프로젝트 API 명세서 작성을 진행합니다.

## 회원 REST API

### 회원가입

| METHOD       | POST    |
| ------------ | ------- |
| URI          | /signup |
| status code  | 201     |
| request body | {       |

email: string,
password: string.
} |
| response body | |

### 로그인

| METHOD       | POST    |
| ------------ | ------- |
| URI          | /signin |
| status code  | 200     |
| request body | {       |

email: string,
password: string.
} |
| response body | JWT token |

### 비번 초기화 요청

| METHOD       | POST   |
| ------------ | ------ |
| URI          | /reset |
| status code  | 200    |
| request body | {      |

email: string,
} |
| response body | |

### 비번 초기화

| METHOD       | PUT    |
| ------------ | ------ |
| URI          | /reset |
| status code  | 200    |
| request body | {      |

password: string,
passwordConfirmation: string
} |
| response body | |

## 도서 REST API

### 전체 도서 조회

| METHOD        | GET                                    |     |
| ------------- | -------------------------------------- | --- |
| URI           | /books?category={id}&search={keywords} |     |
| status code   | 200                                    |     |
| request body  |                                        |     |
| response body | {                                      |

data:
{
books: book[],
total_count: number,
current_page: number,
total_page: number
}
} | |
| | book | {
id: number,
thumbnail_url: string,
title: string
author: string
summary: string
categoryId: number
publish_date: date
price: number
likes: number
} |

### 도서 상세 조회

| METHOD        | GET        |     |
| ------------- | ---------- | --- |
| URI           | /books/:id |     |
| status code   | 200        |     |
| request body  |            |     |
| response body | {          |

image_urls: string[],
title: string
author: string
format: string,
summary: string,
description: string,
index: string,
reviews: review[],
pages: number,
price: number,
publish_date: date
likes: number,
liked: boolean,
isNew: boolean
} | |
| | review | {
user_id: string,
comment: string
} |

### 도서 장바구니 담기

| METHOD        | GET        |     |
| ------------- | ---------- | --- |
| URI           | /books/:id |     |
| status code   | 200        |     |
| request body  |            |     |
| response body | {          |

image_urls: string[],
title: string
author: string
format: string,
summary: string,
description: string,
index: string,
reviews: review[],
pages: number,
price: number,
publish_date: date
likes: number,
liked: boolean,
isNew: boolean
} | |
| | review | {
user_id: string,
comment: string
} |

## 좋아요 REST API

### 좋아요 추가/취소

| METHOD       | PUT             |
| ------------ | --------------- |
| URI          | likes/books/:id |
| status code  | 200             |
| request body | {               |

isLiked:
} |
| response body | |

### 좋아요 취소

| METHOD        | PUT               |
| ------------- | ----------------- |
| URI           | unlikes/books/:id |
| status code   | 200               |
| request body  |                   |
| response body |                   |

## 장바구니 REST API

### 장바구니 담기

| METHOD       | POST  |
| ------------ | ----- |
| URI          | /cart |
| status code  | 201   |
| request body | {     |

bookId: number
count: number
} |
| response body | |

### 장바구니 조회

| METHOD        | GET   |
| ------------- | ----- |
| URI           | /cart |
| status code   | 200   |
| request body  |       |
| response body | {     |

item_id: number
thumbnail_url: string,
title: string,
price: number,
summary: string,
count: number
id: number
}[] |

### 장바구니 도서 삭제

| METHOD        | DELETE         |
| ------------- | -------------- |
| URI           | /cart/:book_id |
| status code   | 200            |
| request body  |                |
| response body |                |

## 주문 REST API

### 결제하기

| METHOD       | POST      |     |
| ------------ | --------- | --- |
| URI          | /checkout |     |
| status code  | 201       |     |
| request body | {         |

items: item[]
} | |
| response body | {
cart_items: items[]
delivery: delivery
total_price: integer
} | |
| | delivery | {
address:string
receiver: string
contact: integer
} |
| | item | {
book_id: number
cart_item_id: number
count: number
} |

### 주문목록 조회

| METHOD        | GET     |     |
| ------------- | ------- | --- |
| URI           | /orders |     |
| status code   | 200     |     |
| request body  |         |     |
| response body | {       |

order_items: item[]
} | |
| | item | {
order_id: number
created_at: timestamp
delivery_info: deliver_info{}
contact: integer
book: book{}
} |
| | | |

### 주문 상 조회

| METHOD        | GET              |     |
| ------------- | ---------------- | --- |
| URI           | /orders:order_id |     |
| status code   | 200              |     |
| request body  |                  |     |
| response body | {                |

book: book[]
} | |

### ERD

![image.png](REST%20API%20%EC%84%A4%EA%B3%84%201~2/image.png)

sql

```
// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  email varchar
  password varchar
}

table books{
  id integer [primary key]
  title varchar
  author varchar
  category varchar
  format varchar
  description text
  isbn varchar
  pages integer
  summary text
  price decimal
  likes integer
  pubDate timestamp
}

table likes{
  id integer [primary key]
  user_id integer
  book_id integer
}

table cart_items {
  id integer [primary key]
  book_id integer
}

table orders {
  id integer [primary key]
  delivery_id integer
  created_at timestamp
  total_price integer
  book_title varchar
  total_count integer
}

table ordered_books{
  id integer [primary key]
  book_id integer
  count integer
}

table delivery_infos{
  id integer [primary key]
  address text
  detail_address text
  post_code integer
  alias varchar
}

```
