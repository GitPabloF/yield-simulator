const SERVER_ERROR = "Something went wrong, try again later"

document.getElementById("simulationForm").addEventListener("submit", handleSubmit)

/**
 * Handle form submission
 * @param {Event} event 
 */
const handleSubmit = async (event) => {
    event.preventDefault()

    resetResult()

    // get form data as an object
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)

    try {
        // call the API
        const response = await fetch("/api/simulation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(SERVER_ERROR);
        }

        const result = await response.json()
        if (!result?.data) {
            throw new Error(SERVER_ERROR);
        }
        renderResult(result.data)
        clearForm()

    } catch (error) {
        const errorElement = document.getElementById("result")
        errorElement.innerHTML = error.message
        errorElement.classList.add("error")
    }

}

const resetResult = () => {
    const resultElement = document.getElementById("result")
    resultElement.innerHTML = ""
    resultElement.classList.remove("error")
}

const clearForm = () => {
    document.getElementById("simulationForm").reset()
}

/**
 * Render the result in the DOM
 * @param {Object} data 
 */
const renderResult = (data) => {

    if (!data?.year1 || !data?.year2 || !data?.year3) {
        document.getElementById("result").innerHTML = SERVER_ERROR
        return
    }

    document.getElementById("result").innerHTML = `
    <h2>Results</h2>

    <h3>Year 1</h3>
    <p>Monthly net: ${data.year1.monthlyNetIncome} €</p>
    <p>Return: ${data.year1.returnRate} %</p>

    <h3>Year 2</h3>
    <p>Monthly net: ${data.year2.monthlyNetIncome} €</p>
    <p>Return: ${data.year2.returnRate} %</p>

    <h3>Year 3</h3>
    <p>Monthly net: ${data.year3.monthlyNetIncome} €</p>
    <p>Return: ${data.year3.returnRate} %</p>

    <strong>Total return over 3 years: ${data.returnOver3Years} %</strong>
  `
}