const calcValues = []
const mathOperations = []

let stringValue = '0'

const operations = {
    multiply: (value1, value2) => value1 * value2,
    divide: (value1, value2) => value1 / value2,
    sum: (value1, value2) => value1 + value2,
    subtract: (value1, value2) => value1 - value2
}

const getStringValue = () => stringValue
const setStringValue = actualValue => { stringValue = actualValue }

const addValueToArray = () => {
    const numericalValue = Number(getStringValue())
    calcValues.push(numericalValue)
}