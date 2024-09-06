if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback) => setTimeout(callback, 0);
}

if (typeof clearImmediate === 'undefined') {
  global.clearImmediate = (timeoutId) => clearTimeout(timeoutId);
}

require('@testing-library/jest-dom');

class TextEncoderMock {
  encode(str) {
    return Buffer.from(str);
  }
}

class TextDecoderMock {
  decode(buffer) {
    return buffer.toString();
  }
}

global.TextEncoder = TextEncoderMock;
global.TextDecoder = TextDecoderMock;