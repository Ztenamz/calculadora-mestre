class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    clear() {
        this.currentOperand = '0'
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
        if (this.currentOperand === '') {
            this.currentOperand = '0'
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString()
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString()
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return

        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '×':
                computation = prev * current
                break
            case '÷':
                computation = prev / current
                break
            case '^':
                computation = Math.pow(prev, current)
                break
            default:
                return
        }

        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    scientificOperation(operation) {
        const current = parseFloat(this.currentOperand)
        if (isNaN(current)) return

        switch (operation) {
            case 'sin':
                this.currentOperand = Math.sin(current * Math.PI / 180)
                break
            case 'cos':
                this.currentOperand = Math.cos(current * Math.PI / 180)
                break
            case 'tan':
                this.currentOperand = Math.tan(current * Math.PI / 180)
                break
            case '√':
                this.currentOperand = Math.sqrt(current)
                break
            case 'log':
                this.currentOperand = Math.log10(current)
                break
            case 'ln':
                this.currentOperand = Math.log(current)
                break
            case 'π':
                this.currentOperand = Math.PI
                break
            case 'e':
                this.currentOperand = Math.E
                break
            case '!':
                this.currentOperand = this.factorial(current)
                break
            default:
                return
        }
    }

    factorial(n) {
        if (n < 0) return NaN
        if (n === 0 || n === 1) return 1
        let result = 1
        for (let i = 2; i <= n; i++) {
            result *= i
        }
        return result
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

const numberButtons = document.querySelectorAll('[data-action="number"]')
const operationButtons = document.querySelectorAll('[data-action="operation"]')
const equalsButton = document.querySelector('[data-action="calculate"]')
const deleteButton = document.querySelector('[data-action="delete"]')
const allClearButton = document.querySelector('[data-action="clear"]')
const scientificButtons = document.querySelectorAll('[data-action="scientific"]')
const previousOperandTextElement = document.getElementById('previous-operand')
const currentOperandTextElement = document.getElementById('current-operand')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

scientificButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.scientificOperation(button.innerText)
        calculator.updateDisplay()
    })
})

// Suporte para teclado
document.addEventListener('keydown', (e) => {
    if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
        calculator.appendNumber(e.key)
        calculator.updateDisplay()
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const operation = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key
        calculator.chooseOperation(operation)
        calculator.updateDisplay()
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute()
        calculator.updateDisplay()
    } else if (e.key === 'Backspace') {
        calculator.delete()
        calculator.updateDisplay()
    } else if (e.key === 'Escape') {
        calculator.clear()
        calculator.updateDisplay()
    }
})