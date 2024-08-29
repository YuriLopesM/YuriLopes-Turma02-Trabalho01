const add = require("../src/add");

describe('Testes básicos', () => {
  it('Sum two numbers', () => {
    const sum = add(1, 1)

    expect(sum).toBe(2)
  })
})