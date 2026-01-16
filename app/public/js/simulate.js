const SERVER_ERROR = "Something went wrong, try again later"

document.getElementById("simulationForm").addEventListener("submit", handleSubmit)

// Toggle data-driven section
document.getElementById("useDataDriven").addEventListener("change", function () {
  const section = document.getElementById("dataDrivenSection")
  section.classList.toggle("show", this.checked)
})

/**
 * Handle form submission
 */
async function handleSubmit(event) {
  event.preventDefault()
  resetResult()

  const formData = new FormData(event.target)
  const data = Object.fromEntries(formData)

  // Validate data-driven fields if enabled
  if (data.useDataDriven === "true") {
    if (!data.surface || !data.bedrooms || !data.locationScore) {
      showError("Please fill in all property characteristics for data-driven prediction.")
      return
    }
  }

  try {
    const response = await fetch("/api/simulation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || SERVER_ERROR)
    }

    const result = await response.json()
    if (!result?.data) throw new Error(SERVER_ERROR)

    renderResult(result)
    scrollToResult()
  } catch (error) {
    showError(error.message)
  }
}

function resetResult() {
  document.getElementById("result").innerHTML = ""
}

function showError(message) {
  document.getElementById("result").innerHTML = `
    <div class="alert-error">${message}</div>
  `
}

function scrollToResult() {
  const resultSection = document.getElementById("result")
  resultSection.scrollIntoView({ behavior: "smooth" })
}

/**
 * Render results
 */
function renderResult(result) {
  const staticData = result.data.static
  const predictedData = result.data.predicted
  const metadata = result.data.predictionMetadata

  if (!staticData?.year1 || !staticData?.year2 || !staticData?.year3) {
    showError(SERVER_ERROR)
    return
  }

  let html = `
    <div class="card result-card shadow-sm mb-3">
      <div class="card-body p-4">
        <h3 class="h5 mb-1">Static Estimation</h3>
        <p class="text-muted small mb-4">Based on 100% occupancy</p>
        
        <div class="row text-center mb-4">
          <div class="col-4">
            <div class="text-muted small">Year 1</div>
            <div class="h5 mb-0">${staticData.year1.monthlyNetIncome} €</div>
            <div class="text-muted small">/ month</div>
          </div>
          <div class="col-4">
            <div class="text-muted small">Year 2</div>
            <div class="h5 mb-0">${staticData.year2.monthlyNetIncome} €</div>
            <div class="text-muted small">/ month</div>
          </div>
          <div class="col-4">
            <div class="text-muted small">Year 3</div>
            <div class="h5 mb-0">${staticData.year3.monthlyNetIncome} €</div>
            <div class="text-muted small">/ month</div>
          </div>
        </div>
        
        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
          <span>Total Return (3 years)</span>
          <span class="h4 mb-0">${staticData.returnOver3Years}%</span>
        </div>
      </div>
    </div>
  `

  if (predictedData && metadata) {
    const badgeClass = `badge-confidence-${metadata.confidence}`

    html += `
      <div class="card result-card predicted shadow-sm">
        <div class="card-body p-4">
          <h3 class="h5 mb-1">Data-Driven Prediction</h3>
          <p class="text-muted small mb-3">Based on ${metadata.similarPropertiesCount} similar properties</p>
          
          <div class="mb-4">
            <span class="badge bg-secondary me-2">Occupancy: ${metadata.occupancyRate}%</span>
            <span class="badge bg-secondary me-2">Avg Night: ${metadata.avgNightlyPrice} €</span>
            <span class="badge ${badgeClass}">Confidence: ${metadata.confidence}</span>
          </div>
          
          <div class="row text-center mb-4">
            <div class="col-4">
              <div class="small opacity-75">Year 1</div>
              <div class="h5 mb-0">${predictedData.year1.monthlyNetIncome} €</div>
              <div class="small opacity-75">/ month</div>
            </div>
            <div class="col-4">
              <div class="small opacity-75">Year 2</div>
              <div class="h5 mb-0">${predictedData.year2.monthlyNetIncome} €</div>
              <div class="small opacity-75">/ month</div>
            </div>
            <div class="col-4">
              <div class="small opacity-75">Year 3</div>
              <div class="h5 mb-0">${predictedData.year3.monthlyNetIncome} €</div>
              <div class="small opacity-75">/ month</div>
            </div>
          </div>
          
          <div class="d-flex justify-content-between align-items-center pt-3 border-top border-light">
            <span>Predicted Return (3 years)</span>
            <span class="h4 mb-0">${predictedData.returnOver3Years}%</span>
          </div>
        </div>
      </div>
    `
  }

  document.getElementById("result").innerHTML = html
}