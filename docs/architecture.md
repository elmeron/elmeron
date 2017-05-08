# Client architecture

```
 +----------+
 | SERVICES | <-+
 +----------+   |
      |         |
      V         |
  +-------+     |
  | DUCKS | <---+
  +-------+     |
      |         |
      V         |
  +---------+   |
  | ACTIONS |   |
  +---------+   |
      |         |
      V         |
 +----------+   |
 | REDUCERS |   |
 +----------+   |
      |         |
      V         |
  +-------+     |
  | STATE |     |
  +-------+     |
      |         |
      V         |
+------------+  |
| COMPONENTS | -+
+------------+
```
