type AnyRest = [...args: any[]]
export type Args<K, T> = T extends DefaultEventMap ? AnyRest : (
  K extends keyof T ? T[K] :
  K extends string | symbol ? AnyRest : never
)
export type Key<K, T> = T extends DefaultEventMap ? string | symbol :
  K extends string | symbol ? K | keyof T : keyof T
export type Key2<K, T> = T extends DefaultEventMap ? string | symbol :
  K extends string | symbol ? K | keyof T : K & keyof T
export type DefaultEventMap = [never]
export type EventMap<T> = Record<keyof T, any[]> | DefaultEventMap
export type Listener<K, T, F> = T extends DefaultEventMap ? F : (
  K extends keyof T ? (
    T[K] extends unknown[] ? (...args: T[K]) => void : never
  ) : K extends string | symbol ? F : never
)

export type Listener1<K, T> = Listener<K, T, (...args: any[]) => void>
export type Listener2<K, T> = Listener<K, T, Function>
