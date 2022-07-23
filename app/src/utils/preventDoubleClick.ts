let isCalled = false;
let timer: NodeJS.Timeout;

export const preventDoubleClick = (
  functionToBeCalled: () => void,
  interval = 1000,
) => {
  if (!isCalled) {
    isCalled = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      isCalled = false;
    }, interval);
    return functionToBeCalled();
  }
};
