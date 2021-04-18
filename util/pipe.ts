/*

Pipe

Some languages allow you to take a value apply multiple functions to it one after the other.

```
# Example
result = 100
  |> add50
  |> subtract10
  |> divide2

  # (((100 + 50) - 10) / 2) = 70
```

```
const result = pipe(
  100, // first argument is the input
  add50,
  subtract10,
  divide2
)
```

Curried version lets you call like:

const result = pipes(
  add50,
  subtract10,
  divide2
)(100)

or create a piping function you can use later:

const calcuate = pipes(
  add50,
  subtract10,
  divide2
)

const result = calcuate(100)

*/

export const pipe = (x: any, ...fns: any[]) => fns.reduce((v, f) => f(v), x)

/*
  Curried version
*/
export const pipes = (...fns: any[]) => (x: any) => fns.reduce((v, f) => f(v), x);
