// Format date
function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Load simulations from API
async function loadSimulations() {
    try {
        const response = await fetch('/api/admin/simulations')
        const result = await response.json()

        if (!result.success) {
            throw new Error(result.message)
        }

        // Update table
        const tbody = document.getElementById('simulationsTable')

        if (result.data.length === 0) {
            tbody.innerHTML = `
            <tr>
              <td colspan="6" class="text-center py-4 text-muted">No simulations yet</td>
            </tr>
          `
            return
        }

        tbody.innerHTML = result.data.map(sim => `
          <tr>
            <td>${formatDate(sim.createdAt)}</td>
            <td>${sim.prospectEmail}</td>
            <td class="text-end">${sim.purchasePrice} €</td>
            <td class="text-end">${sim.monthlyRent} €</td>
            <td class="text-end fw-semibold">${sim.result?.returnOver3Years || '-'}%</td>
            <td class="text-center">
              ${sim.surface ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'}
            </td>
          </tr>
        `).join('')

    } catch (error) {
        console.error('Error loading simulations:', error)
        document.getElementById('simulationsTable').innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-4 text-danger">Failed to load simulations</td>
          </tr>
        `
    }
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadSimulations)