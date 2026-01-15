const mongoose = require("mongoose")

/**
 * Simulation schema for the yield simulator
 */
const SimulationSchema = new mongoose.Schema(
  {
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    annualRentalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    prospectEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    managementCommission: {
        year1: {
            type: Number,
            required: true,
            default: 0.3, 
        },
        year2: {
            type: Number,
            required: true,
            default: 0.25,
        },
        year3Plus: {
            type: Number,
            required: true,
            default: 0.2,
        },
    },

    result: {
      year1: {
        monthlyNetIncome: {
          type: Number,
          required: true,
        },
        annualNetIncome: {
          type: Number,
          required: true,
        },
        returnRate: {
          type: Number,
          required: true,
        },
      },

      year2: {
        monthlyNetIncome: {
          type: Number,
          required: true,
        },
        annualNetIncome: {
          type: Number,
          required: true,
        },
        returnRate: {
          type: Number,
          required: true,
        },
      },

      year3: {
        monthlyNetIncome: {
          type: Number,
          required: true,
        },
        annualNetIncome: {
          type: Number,
          required: true,
        },
        returnRate: {
          type: Number,
          required: true,
        },
      },

      returnOver3Years: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Simulation", SimulationSchema)
