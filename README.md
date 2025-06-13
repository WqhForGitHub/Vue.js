# 命名方法

## 1. camelCase（驼峰命名法）

- **描述:** 第一个单词以小写字母开头，后续每个单词的首字母大写。
- **示例:** `firstName`, `getElementById`, `userProfileData`
- 应用场景:
  - JavaScript 变量和函数名。
  - Java 变量和方法名。
  - React/Vue 组件中的属性 (props) 名。

<br>

## 2. pascalCase（帕斯卡命名法）

- **描述:** 每个单词的首字母都大写。
- **示例:** `FirstName`, `UserProfileData`, `MyComponent`
- 应用场景:
  - JavaScript 类名和构造函数。
  - React/Vue 组件名。
  - C# 类名和方法名。

<br>

## 3. snake_case（蛇形命名法）

- **描述:** 所有字母小写，单词之间用下划线分隔。
- **示例:** `first_name`, `user_profile_data`, `get_element_by_id`
- 应用场景:
  - Python 变量和函数名。
  - 数据库字段名。
  - 某些配置文件。

<br>

## 4. kebab-case（短横线命名法）

- **描述:** 所有字母小写，单词之间用短横线分隔。
- **示例:** `first-name`, `user-profile-data`, `my-component`
- 应用场景:
  - CSS 类名。
  - HTML 属性名 (自定义属性)。
  - URL 路径。
  - 文件名。

<br>

## 5. **UPPER_SNAKE_CASE (大写蛇形命名法)**

- **描述:** 所有字母大写，单词之间用下划线分隔。
- **示例:** `FIRST_NAME`, `USER_PROFILE_DATA`, `API_KEY`
- 应用场景:
  - 常量。
  - 环境变量。







## 疑问点

* 事件校验



# 常见的透传 Attributes

1. HTML Attributes:
   - `class` [1]
   - `style` [1]
   - `id` [1]
   - `data-*` 自定义属性
   - `aria-*` 无障碍属性
2. 事件监听器 (Event Listeners):
   - `@click` [1]
   - `@mouseover`
   - `@input`
   - 自定义事件
