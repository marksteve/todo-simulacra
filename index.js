var bind = require('simulacra')

var data = {
  isEmpty: false,
  items: [
    "Water the plants",
    "Feed the dog",
  ],
  form: {
    disabled: true,
  },
}

var main = document.querySelector('main')

var app = document.getElementById('app').content
var bindings = bind(app, {
  'isEmpty': bind(app.querySelector('p.empty'), mountEmpty),
  'items': bind(app.querySelector('li'), mountItem),
  'form': bind(app.querySelector('form'), {
    'disabled': bind(app.querySelector('button.add'), mountAddButton),
  }),
})

function mountEmpty(node, value) {
  node.style.display = value ? 'block' : 'none'
}

function mountItem(node, value, oldValue, index) {
  node.querySelector('span').textContent = value
  node.querySelector('button.done')
    .addEventListener('click', function(e) {
      e.preventDefault()
      data.items.splice(index, 1)
      data.items = data.items
      data.isEmpty = data.items.length < 1
    })
}

function mountAddButton(node, value) {
  node.disabled = value
}

var el = bind(data, bindings)
main.appendChild(el)

main.querySelector('form')
  .addEventListener('submit', function(e) {
    e.preventDefault()
    var todo = e.target.todo
    data.items = data.items.concat(todo.value)
    data.form.disabled = true
    data.isEmpty = data.items.length < 1
    todo.value = ''
  })

main.querySelector('input[name=todo]')
  .addEventListener('input', function(e) {
    data.form.disabled = e.target.value.length < 1
  })

