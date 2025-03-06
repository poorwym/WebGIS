## 标记语言和脚本语言
- **标记语言**：主要用于描述数据的结构和表示方式，通常不具备逻辑控制能力。标记语言用于格式化文档、描述网页内容或存储数据，例如 HTML、XML、Markdown。
- **脚本语言**：主要用于编写可执行的程序脚本，控制程序的行为，具有逻辑控制结构（如循环、条件判断等）。脚本语言用于自动化任务、交互式网页编程、服务器端开发等，例如 Python、JavaScript、Shell 脚本。

### 脚本语言的分类
- **解释型语言**：解释型语言在运行时逐行解释代码，执行效率较低。常见的解释型语言包括 Python、JavaScript。
- **编译型语言**：编译型语言在运行前将代码编译成机器码，执行效率较高。常见的编译型语言包括 C、C++、Java。
- **混合型语言**：混合型语言结合了解释型和编译型语言的特点，执行效率介于两者之间。常见的混合型语言包括 Ruby、Lua。

---

## HW2一些知识点

### 1. 怎么让子组件修改父组件的state

react中可以把setState对象在props中传递给子组件。

```jsx
import { useState, useEffect } from "react";

function Child({ onStateChange }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    onStateChange(count); // 当 count 变化时，通知父组件
  }, [count, onStateChange]);

  return <button onClick={() => setCount(count + 1)}>点击增加 {count}</button>;
}

function Parent() {
  const [childState, setChildState] = useState(0);

  return (
    <div>
      <h1>子组件的 state: {childState}</h1>
      <Child onStateChange={setChildState} />
    </div>
  );
}

export default Parent;
```

### 2. 关于请求

貌似基于jquery的请求已经过时了，更加先进的可以用fetch函数

用`async`和`await`配合`fetch`可以使代码可读性更好。
```jsx
async function fetchData() {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }

    let data = await response.json(); // 等待解析 JSON
    console.log(data);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

fetchData();
```

### 3. 关于一些语法糖

showWeather 为true就渲染Weather.
```jsx
{showWeather && <Weather />}
```

### 4. Promise, asynic 和 await关键字

#### Promise
Promise 机制本身是一种异步操作，但是 javascript 设计上就是单线程的，所以本质是在等待某个结果返回前在线程中继续运行别的代码而不是传统的线性运行。

Promise：
Promise 本质是一种对象，主要由 执行器函数（executor function）、状态（state） 和 回调队列（callback queue） 组成。
- 1. 执行器函数（executor function）
    - Promise 构造函数接受一个 执行器函数，该函数包含 resolve 和 reject 两个回调函数，分别用于改变 Promise 的状态。
    - executor 立即执行，不能异步执行。

- 2. 状态（state）

  - pending（进行中）：初始状态，既没有成功也没有失败。
  - fulfilled（已成功）：异步操作成功，调用 resolve(value) 进入此状态，并返回 value 作为最终结果。
  - rejected（已失败）：异步操作失败，调用 reject(error) 进入此状态，并返回 error 作为最终原因。

- 3. 回调队列（callback queue）
  - 由于 Promise 是异步的，它不会立刻返回结果，而是将回调函数存入队列，等到 resolve 或 reject 触发后，再执行对应的 .then() 或 .catch() 代码。

所以promise可以异步执行多个操作：
```javascript
myPromise
    .then(result => console.log("成功:", result))
    .catch(error => console.log("失败:", error))
    .finally(() => console.log("执行完毕"));
```

多个异步任务需要按顺序执行时，可以使用**链式调用**：
```javascript
new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), 1000);
})
    .then(result => {
        console.log(result); // 1
        return result * 2;
    })
    .then(result => {
        console.log(result); // 2
        return result * 3;
    })
    .then(result => {
        console.log(result); // 6
    });
```

### Promise.all、Promise.race 和 Promise.allSettled

- Promise.all([p1, p2, p3])
  - 等待所有 Promise 完成，返回所有成功结果（如果有一个失败，就返回失败）。
```javascript
Promise.all([
    fetch("https://jsonplaceholder.typicode.com/posts/1"),
    fetch("https://jsonplaceholder.typicode.com/posts/2")
])
.then(responses => Promise.all(responses.map(res => res.json())))
.then(data => console.log(data))
.catch(error => console.error(error));
```

- Promise.race([p1, p2, p3])
  - 只返回最先完成的 Promise（无论成功还是失败）。

```javascript
Promise.race([
    new Promise(resolve => setTimeout(() => resolve("A"), 1000)),
    new Promise(resolve => setTimeout(() => resolve("B"), 500))
])
.then(result => console.log(result)); // B
```

- Promise.allSettled([p1, p2, p3])
  - 等待所有 Promise 完成，无论成功或失败，返回所有结果（不会因某个 Promise 失败而中断）。

```javascript
Promise.allSettled([
    Promise.resolve("成功"),
    Promise.reject("失败"),
])
.then(results => console.log(results));
```

#### async 和 await

本质就是promise的语法糖
await关键字只能在声明了async的函数中使用。

```javascript
async function fetchData() {
    try {
        let response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

fetchData();
```

相当于

```javascript
new Promise(fetch("https://jsonplaceholder.typicode.com/posts/1"))
  .then(response => response.json())
  .catch(error => {console.log(error)})
;
```

`async`中不同的`await`间是链式执行的，不是同步并发的，如果要并发，得使用`Promise.all`

---