export const pipe = (x: any, ...fns: any[]) => fns.reduce((v, f) => f(v), x)

/*
  Curried version
*/
export const pipes = (...fns: any[]) => (x: any) => fns.reduce((v, f) => f(v), x);
