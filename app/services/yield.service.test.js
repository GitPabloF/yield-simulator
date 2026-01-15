const { calculateYield } = require("./yield.service")

describe("calculateYield", () => {
  test("calculates net income and return for each year", () => {
    const result = calculateYield({
      purchasePrice: 300000,
      monthlyRent: 2000,
      annualRentalFee: 1200,
      managementCommissionYear1: 0.3,
      managementCommissionYear2: 0.25,
      managementCommissionYear3Plus: 0.2
    })

    expect(result.year1.monthlyNetIncome).toBe(1300)
    expect(result.year1.annualNetIncome).toBe(15600)
    expect(result.year1.returnRate).toBe(5.2)

    expect(result.year2.monthlyNetIncome).toBe(1400)
    expect(result.year2.annualNetIncome).toBe(16800)
    expect(result.year2.returnRate).toBe(5.6)

    expect(result.year3.monthlyNetIncome).toBe(1500)
    expect(result.year3.annualNetIncome).toBe(18000)
    expect(result.year3.returnRate).toBe(6)

    expect(result.returnOver3Years).toBe(16.8)
  })

  test("uses custom commission rates", () => {
    const result = calculateYield({
      purchasePrice: 500000,
      monthlyRent: 3000,
      annualRentalFee: 2000,
      managementCommissionYear1: 0.25,
      managementCommissionYear2: 0.2,
      managementCommissionYear3Plus: 0.15
    })

    expect(result.year1.monthlyNetIncome).toBeCloseTo(2083.33, 2)
    expect(result.year1.annualNetIncome).toBeCloseTo(25000, 2)
    expect(result.year2.monthlyNetIncome).toBeCloseTo(2233.33, 2)
    expect(result.year2.annualNetIncome).toBeCloseTo(26800, 2)
    expect(result.year3.monthlyNetIncome).toBeCloseTo(2383.33, 2)
    expect(result.year3.annualNetIncome).toBeCloseTo(28600, 2)
    expect(result.returnOver3Years).toBeCloseTo(16.08, 2)
  })

  test("throws if purchase price is invalid", () => {
    expect(() =>
      calculateYield({
        purchasePrice: 0,
        monthlyRent: 2000,
        annualRentalFee: 1200
      })
    ).toThrow("Purchase price must be greater than zero.")
  })

  test("throws if monthly rent is negative", () => {
    expect(() =>
      calculateYield({
        purchasePrice: 300000,
        monthlyRent: -100,
        annualRentalFee: 1200
      })
    ).toThrow("Monthly rent cannot be negative.")
  })

  test("throws if annual rental fee is negative", () => {
    expect(() =>
      calculateYield({
        purchasePrice: 300000,
        monthlyRent: 2000,
        annualRentalFee: -100
      })
    ).toThrow("Annual rental fee cannot be negative.")
  })

  test("throws if management commission is negative", () => {
    expect(() =>
      calculateYield({
        purchasePrice: 300000,
        monthlyRent: 2000,
        annualRentalFee: 1200,
        managementCommissionYear1: -0.1
      })
    ).toThrow("Management commission year 1 cannot be negative.")
  })
})