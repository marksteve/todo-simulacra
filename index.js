const bindObject = require("simulacra");
const bindEvents = require("simulacra/helpers").bindEvents;

const combine = fns => (node, value, previousValue, path) => {
  let result = null;
  fns.forEach(fn => result = fn(node, value, previousValue, path));
  return result;
};

const findIndex = (list, prop, val) => {
  let result = null;

  for (let i = 0, t = list.length; i < t; i++) {
    if (list[i][prop] === val) {
      result = i;
      break;
    }
  }
  return result;
};

const state = {
  empty: undefined,
  items: [
    { id: 1, label: "Water the plants" },
    { id: 2, label: "Feed the dog" },
  ],
  form: {
    text: "",
    disabled: true
  },
};

let nextId = state.items.length + 1;

const template = document.getElementById("app");

const mappings = {
  empty: ".empty",
  items: [ ".items", {
    label: ".label",
    id: [ "button.done", bindEvents({
      click: (el, path) => {
        const index = findIndex(state.items, "id", path.target.id);
        state.items.splice(index, 1);
        if (state.items.length === 0) {
          state.empty = "Nothing to do!";
        }
      }
    }) ]
  } ],
  form: [ "form", {
    text: [ "[name=todo]", combine([
      bindEvents({
        input: evt => {
          state.form.disabled = evt.target.value.length < 1;
        }
      }),
      (el, val) => val
    ]) ],
    disabled: [ "button.add", (el, val) => {
      el.disabled = val;
    } ]
  }, bindEvents({
    submit: evt => {
      evt.preventDefault();
      const todo = evt.target.todo.value;
      state.items.push({ id: nextId++, label: todo });
      state.form.disabled = true;
      state.form.text = "";
      state.empty = undefined;
    }
  }) ]
};

const node = bindObject(state, [ template, mappings ]);
document.body.appendChild(node);

