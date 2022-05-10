import { keysArrShifted, keysArr } from './keys.js';

const keyboard = document.createElement('div');
const textarea = document.createElement('textarea');
const autofocus = document.createAttribute('autofocus');
const myText = document.createElement('div');
const keyValuesEn = Object.values(keysArr[0]);
const keyValuesRu = Object.values(keysArr[1]);
const keyValuesEnShifted = Object.values(keysArrShifted[0]);
const keyValuesRuShifted = Object.values(keysArrShifted[1]);
const keysWithFunctions = [
  'Backspace',
  'CapsLock',
  'Enter',
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltRight',
  'AltLeft',
  'Tab',
  'Space',
  'MetaLeft',
];
let shifted = false;
let capsed = false;

myText.classList.add('my-text');
textarea.setAttributeNode(autofocus);
keyboard.classList.add('keyboard');
document.body.append(textarea);
document.body.append(keyboard);
document.body.append(myText);

myText.innerText = `Клавиатура сделана на ОС Windows, 
  комбинация для смены языка левый Alt + левый Shift`;

const initKeyboard = (keyLang) => {
  let valueStr = '';
  const props = Object.entries(keyLang);
  props.forEach((item) => {
    if (item[0] === 'Tab') {
      valueStr += '<div class="clearfix"></div>';
    }
    valueStr += `<div data-keycode='${item[0]}' class='key ${item[1]}'>${item[1]}</div>`;
  });
  keyboard.innerHTML = valueStr;
};

if (localStorage.getItem('en') === 'true') {
  initKeyboard(keysArr[0]);
} else {
  initKeyboard(keysArr[1]);
}

const keysCollection = document.querySelectorAll('.key');

const setKeysContent = (objRu, objEn) => {
  if (localStorage.getItem('en') === 'true') {
    keysCollection.forEach((item, index) => {
      if (capsed && !keysWithFunctions.includes(item.dataset.keycode)) {
        item.textContent = objEn[index].toUpperCase();
      } else item.textContent = objEn[index];
    });
  } else {
    keysCollection.forEach((item, index) => {
      if (capsed && !keysWithFunctions.includes(item.dataset.keycode)) {
        item.textContent = objRu[index].toUpperCase();
      } else item.textContent = objRu[index];
    });
  }
};

const drawText = (e, obj) => {
  const values = Object.entries(obj);
  values.forEach((item) => {
    if (e.code === item[0]) {
      if (capsed) {
        textarea.value += item[1].toUpperCase();
      } else textarea.value += item[1];
    }
  });
};
const drawTextClick = (e, obj) => {
  const values = Object.entries(obj);
  values.forEach((item) => {
    if (e.target.dataset.keycode === item[0]) {
      if (capsed) {
        textarea.value += item[1].toUpperCase();
      } else textarea.value += item[1];
    }
  });
};

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  keysCollection.forEach((item) => {
    if (e.code === 'CapsLock' && item.dataset.keycode === 'CapsLock') {
      item.classList.toggle('active');
      if (!capsed) {
        capsed = true;
        setKeysContent(keyValuesRu, keyValuesEn);
      } else {
        capsed = false;
        setKeysContent(keyValuesRu, keyValuesEn);
      }
    }
    if (e.code === item.dataset.keycode && e.code !== 'CapsLock') {
      item.classList.add('active');
      if (!keysWithFunctions.includes(e.code)) {
        if (localStorage.getItem('en') === 'true' && !shifted) {
          drawText(e, keysArr[0]);
        } else if (localStorage.getItem('en') === 'false' && !shifted) {
          drawText(e, keysArr[1]);
        } else if (localStorage.getItem('en') === 'true' && shifted) {
          drawText(e, keysArrShifted[0]);
        } else drawText(e, keysArrShifted[1]);
      }
    }
  });

  if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !e.altKey) {
    shifted = true;
    setKeysContent(keyValuesRuShifted, keyValuesEnShifted);
  }

  if (e.altKey && e.code === 'ShiftLeft') {
    if (localStorage.getItem('en') === 'true') {
      localStorage.setItem('en', 'false');
      keysCollection.forEach((item, index) => {
        item.textContent = keyValuesRu[index];
      });
    } else {
      localStorage.setItem('en', 'true');
      keysCollection.forEach((item, index) => {
        item.textContent = keyValuesEn[index];
      });
    }
  }

  if (e.code === 'Backspace') {
    textarea.value = textarea.value.slice(0, textarea.value.length - 1);
  }

  if (e.code === 'Enter') {
    textarea.value += '\n';
  }
  if (e.code === 'Space') {
    textarea.value += ' ';
  }
  if (e.code === 'Tab') {
    textarea.value += '    ';
  }
});

document.addEventListener('keyup', (e) => {
  if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !e.altKey) {
    shifted = false;
    setKeysContent(keyValuesRu, keyValuesEn);
  }

  keysCollection.forEach((item) => {
    if (e.code === item.dataset.keycode && e.code !== 'CapsLock') {
      item.classList.remove('active');
    }
  });
});

keyboard.addEventListener('mousedown', (e) => {
  if (e.target.closest('.key')) {
    if (e.target.dataset.keycode === 'CapsLock') {
      e.target.classList.toggle('active');
      if (!capsed) {
        capsed = true;
        setKeysContent(keyValuesRu, keyValuesEn);
      } else {
        capsed = false;
        setKeysContent(keyValuesRu, keyValuesEn);
      }
    }

    if (e.target.dataset.keycode !== 'CapsLock') {
      e.target.classList.add('active');
      if (!keysWithFunctions.includes(e.target.dataset.keycode)) {
        if (localStorage.getItem('en') === 'true' && !shifted) {
          drawTextClick(e, keysArr[0]);
        } else if (localStorage.getItem('en') === 'false' && !shifted) {
          drawTextClick(e, keysArr[1]);
        } else if (localStorage.getItem('en') === 'true' && shifted) {
          drawTextClick(e, keysArrShifted[0]);
        } else drawTextClick(e, keysArrShifted[1]);
      }
    }
    if (e.target.dataset.keycode === 'Backspace') {
      textarea.value = textarea.value.slice(0, textarea.value.length - 1);
    }

    if (e.target.dataset.keycode === 'Enter') {
      textarea.value += '\n';
    }
    if (e.target.dataset.keycode === 'Space') {
      textarea.value += ' ';
    }
    if (e.target.dataset.keycode === 'Tab') {
      textarea.value += '    ';
    }
    if (
      e.target.dataset.keycode === 'ShiftLeft' || e.target.dataset.keycode === 'ShiftRight') {
      shifted = true;
      setKeysContent(keyValuesRuShifted, keyValuesEnShifted);
    }
  }
});

keyboard.addEventListener('mouseup', (e) => {
  if (e.target.dataset.keycode !== 'CapsLock') {
    e.target.classList.remove('active');
  }

  if (e.target.dataset.keycode === 'ShiftLeft' || e.target.dataset.keycode === 'ShiftRight') {
    shifted = false;
    setKeysContent(keyValuesRu, keyValuesEn);
  }
});
