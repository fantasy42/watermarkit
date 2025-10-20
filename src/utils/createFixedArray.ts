const arrayWeakRefMap = new Map<number, WeakRef<readonly number[]>>();

export function createFixedArray(length: number): readonly number[] {
  let ref: WeakRef<readonly number[]> | undefined;
  let array: readonly number[] | undefined;
  if (arrayWeakRefMap.has(length)) {
    ref = arrayWeakRefMap.get(length)!;
    array = ref.deref();
  }

  if (!array) {
    array = [...Array.from({length}).keys()];

    ref = new WeakRef(array);
    arrayWeakRefMap.set(length, ref);
  }

  return array;
}
